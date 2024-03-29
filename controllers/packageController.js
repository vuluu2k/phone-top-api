import packages from '../models/package';
import product from '../models/product';
import auth from '../models/auth';
import dayjs from 'dayjs';
import validator from 'validator';

class packageControlller {
  async getPackage(req, res) {
    const { isAccess, phoneNumber, codePackage, userId } = req.query;

    try {
      const view_package = await packages
        .find({
          $and: [
            (isAccess && { isAccess: isAccess }) || {},
            (validator.isMongoId(codePackage) && { _id: codePackage }) || {},
            (validator.isMobilePhone(phoneNumber) && { phone_number: phoneNumber }) || {},
            (validator.isMongoId(userId) && { user_id: userId }) || {},
          ],
        })
        .populate('user_id')
        .sort({ updatedAt: 'desc' });
      if (!view_package) {
        return res.json({ success: false, message: 'Không có dữ liệu đơn hàng', view_package });
      }
      res.json({
        success: true,
        message: 'Tải dữ liệu đơn hàng thành công',
        view_package,
        dataSearch: { isAccess, phoneNumber, codePackage, userId },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
    }
  }

  async getCheckPackage(req, res) {
    const { code_package, phone_number } = req.query;

    try {
      const check_package = await packages.findOne({ _id: code_package, phone_number: phone_number }).sort({ updatedAt: 'desc' });
      if (!check_package) {
        return res.json({ success: false, message: 'Thông tin không chính xác', check_package });
      }
      res.json({ success: true, message: 'Tìm thấy đơn hàng của bạn', view_package: check_package });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
    }
  }

  async createPackage(req, res) {
    const { user_id, products, full_name, phone_number, email, voucher, value, address, is_access, note, is_pay } = req.body;
    if (!products || !full_name || !phone_number || !email || !value || !address || !is_pay)
      return res.json({ success: false, message: 'Thiếu thông tin thanh toán' });

    try {
      const newPackage = new packages({
        user_id,
        products,
        full_name,
        phone_number,
        email,
        voucher,
        value,
        address,
        is_access,
        note,
        is_pay,
        historys: [{ status_vi: 'Đơn mới', status_en: 'new', note: 'Bạn có một đơn mới', createdAt: Date.now() }],
      });
      await newPackage.save();
      res.json({ success: true, message: 'Bạn có một đơn hàng mới', package_new: newPackage });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
    }
  }

  async acceptPackage(req, res) {
    const { package_id } = req.body;
    try {
      const packageCheck = await packages.findOne({ _id: package_id });
      if (packageCheck.is_pay === 'Thanh toán tại cửa hàng') {
        const packageAccept = await packages.findOneAndUpdate(
          { _id: package_id },
          {
            isAccess: true,
            current_status_en: 'success',
            current_status_vi: 'Thành công',
            historys: packageCheck.historys.concat([
              { status_vi: 'Thành công', status_en: 'success', note: 'Đã thanh toán thành công tại cửa hàng', createdAt: Date.now() },
            ]),
          },
          { new: true }
        );

        if (!packageAccept) return res.json({ success: false, message: 'Cập nhật không thành công' });

        packageAccept.products.map(async item => {
          const productItem = await product.findOne({ _id: item.product_id });
          await product.findOneAndUpdate(
            { _id: item.product_id },
            { quantity: productItem.quantity - item.quantity, cout_buy: productItem.cout_buy + item.quantity },
            { new: true }
          );
        });

        return res.json({ success: true, message: 'cập nhật trạng thái thành công', package_accept: packageAccept });
      } else {
        const packageAccept = await packages.findOneAndUpdate(
          { _id: package_id },
          {
            isAccess: true,
            current_status_en: 'waiting',
            current_status_vi: 'Chờ lấy hàng',
            historys: packageCheck.historys.concat([
              {
                status_vi: 'Chờ lấy hàng',
                status_en: 'waiting',
                note: 'Đơn hàng đang trong trạng thái lấy hàng chờ đối tác vận chuyển sang lấy hàng',
                createdAt: Date.now(),
              },
            ]),
          },
          { new: true }
        );

        if (!packageAccept) return res.json({ success: false, message: 'Cập nhật trạng thái không thành công' });

        return res.json({ success: true, message: 'cập nhật trạng thái thành công', package_accept: packageAccept });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
    }
  }

  async sendShipper(req, res) {
    const { package_id } = req.body;

    try {
      const packageSend = await packages.findOne({ _id: package_id });

      if (packageSend?.is_pay === 'Thanh toán tại cửa hàng') return res.json({ success: false, message: 'Đơn hàng được thanh toán tại cửa hàng' });
      if (!packageSend?.isAccess)
        return res.json({ success: false, message: 'Đơn hàng chưa được xác nhận vui lòng xác nhận trước khi chuyển cho shipper' });
      if (packageSend?.current_status_en === 'shipper_picked') return res.json({ success: false, message: 'Đơn hàng đã chuyển cho shipper' });
      if (packageSend?.current_status_en !== 'waiting' || packageSend?.current_status_en === 'success')
        return res.json({ success: false, message: 'Trạng thái đơn hàng không cho phép chuyển cho shipper' });

      packageSend.products.map(async item => {
        const productItem = await product.findOne({ _id: item.product_id });
        await product.findOneAndUpdate(
          { _id: item.product_id },
          { quantity: productItem.quantity - item.quantity, cout_buy: productItem.cout_buy + item.quantity },
          { new: true }
        );
      });

      let dataSend = {
        cod: 15000,
        current_status_en: 'shipper_picked',
        current_status_vi: 'Đã lấy hàng',
        historys: packageSend.historys.concat([
          {
            status_vi: 'Đã lấy hàng',
            status_en: 'shipper_picked',
            note: `Shiper đang lấy hàng lúc ${dayjs(Date.now()).format('HH:mm DD/MM/YYYY')}`,
            createdAt: Date.now(),
          },
        ]),
      };

      const packageChangeSend = await packages.findOneAndUpdate({ _id: package_id }, dataSend, { new: true });

      if (!packageChangeSend) return res.json({ success: false, message: 'Cập nhật trạng thái không thành công' });

      return res.json({ success: true, message: 'cập nhật trạng thái thành công', packageChangeSend });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
    }
  }

  async deletePackage(req, res) {
    const { id } = req.params;
    try {
      const packageDelete = await packages.findOneAndDelete({ _id: id });
      if (packageDelete?.isAccess && packageDelete?.current_status_en !== 'success' && packageDelete?.current_status_en !== 'waiting') {
        packageDelete.products.map(async item => {
          const productItem = await product.findOne({ _id: item.product_id });
          await product.findOneAndUpdate(
            { _id: item.product_id },
            { quantity: productItem.quantity + item.quantity, cout_buy: productItem.cout_buy - item.quantity },
            { new: true }
          );
        });
      }
      if (!packageDelete) return res.json({ success: false, message: 'Đơn hàng không tồn tại' });
      res.json({ success: true, message: `Hủy thành công đơn hàng ${id}`, id, package_delete: packageDelete });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
    }
  }

  async getTurnover(req, res) {
    const { startDate, endDate } = req.query;
    try {
      const packageSuccess = await packages
        .find({
          isAccess: true,
          current_status_en: 'success',
          updatedAt: {
            $gte: dayjs(startDate).format('YYYY-MM-DDTHH:mm:ss.004[Z]') || Date.now(),
            $lte: dayjs(endDate).format('YYYY-MM-DDTHH:mm:ss.004[Z]') || Date.now(),
          },
        })
        .sort({ updatedAt: 'desc' })
        .select('value updatedAt');

      const productCount = await product.count({
        updatedAt: {
          $gte: dayjs(startDate).format('YYYY-MM-DDTHH:mm:ss.004[Z]') || Date.now(),
          $lte: dayjs(endDate).format('YYYY-MM-DDTHH:mm:ss.004[Z]') || Date.now(),
        },
      });

      const productCountOld = await product.count({
        updatedAt: {
          $lte: dayjs().subtract(1, 'year').format('YYYY-MM-DDTHH:mm:ss.004[Z]') || Date.now(),
        },
      });

      const packageAcceptCount = await packages.count({
        isAccess: true,
        updatedAt: {
          $gte: dayjs(startDate).format('YYYY-MM-DDTHH:mm:ss.004[Z]') || Date.now(),
          $lte: dayjs(endDate).format('YYYY-MM-DDTHH:mm:ss.004[Z]') || Date.now(),
        },
      });

      const packageNotAcceptCount = await packages.count({
        isAccess: false,
        updatedAt: {
          $gte: dayjs(startDate).format('YYYY-MM-DDTHH:mm:ss.004[Z]') || Date.now(),
          $lte: dayjs(endDate).format('YYYY-MM-DDTHH:mm:ss.004[Z]') || Date.now(),
        },
      });

      const userCount = await auth.count({
        role: 0,
        updatedAt: {
          $gte: dayjs(startDate).format('YYYY-MM-DDTHH:mm:ss.004[Z]') || Date.now(),
          $lte: dayjs(endDate).format('YYYY-MM-DDTHH:mm:ss.004[Z]') || Date.now(),
        },
      });

      const codShipper = await packages
        .find({
          isAccess: true,
          cod: { $gte: 1000 },
          updatedAt: {
            $gte: dayjs(startDate).format('YYYY-MM-DDTHH:mm:ss.004[Z]') || Date.now(),
            $lte: dayjs(endDate).format('YYYY-MM-DDTHH:mm:ss.004[Z]') || Date.now(),
          },
        })
        .sort({ updatedAt: 'desc' })
        .select('cod updatedAt');

      if (!packageSuccess) res.json({ success: false, message: 'Thông kê đang xảy ra vấn đề không lấy được từ cơ sở dữ liệu' });

      res.json({
        success: true,
        message: 'Danh sách thanh toán thành công',
        packages: packageSuccess,
        productCount,
        productCountOld,
        packageAcceptCount,
        packageNotAcceptCount,
        userCount,
        codShipper,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
    }
  }

  async sendRequest(req, res) {
    const { codePackage, note, isTrash } = req.body;

    if (!note && isTrash !== false) return res.json({ success: false, message: 'Bạn chưa nhập lí do' });
    try {
      const requestPackage = await packages.findOne({ _id: codePackage });
      if (!requestPackage) res.json({ success: false, message: 'Đơn hàng không tồn tại' });

      const request = await packages.findOneAndUpdate({ _id: codePackage }, { isRequest: { note, isTrash: isTrash } }, { new: true });
      if (!request) res.json({ success: false, message: 'Gửi yêu cầu thất bại' });
      res.json({ success: true, message: 'Gửi yêu cầu thành công', request });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
    }
  }
}

export default new packageControlller();
