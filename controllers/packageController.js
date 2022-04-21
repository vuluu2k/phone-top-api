import packages from '../models/package';
import product from '../models/product';

class packageControlller {
  async getPackage(req, res) {
    const { isAccess } = req.query;
    try {
      const view_package = await packages
        .find({ $and: [(isAccess && isAccess !== String(undefined) && { isAccess }) || {}] })
        .sort({ updatedAt: 'desc' });
      if (!view_package) {
        return res.json({ success: false, message: 'Không có dữ liệu đơn hàng', view_package });
      }
      res.json({ success: true, message: 'Tải dữ liệu đơn hàng thành công', view_package });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
    }
  }

  async getCheckPackage(req, res) {
    const { code_package, phone_number } = req.query;

    try {
      const check_package = await packages.findOne({ _id: code_package, phone_number: phone_number });
      if (!check_package) {
        return res.json({ success: false, message: 'Thông tin không chính xác', check_package });
      }
      res.json({ success: true, message: 'Tìm thấy đơn hàng của bạn', check_package });
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

        if (!packageAccept) return res.json({ success: false, message: 'Cập nhật không thành công' });

        return res.json({ success: true, message: 'cập nhật trạng thái thành công', package_accept: packageAccept });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
    }
  }

  // async editCategory(req, res) {
  //   const { id } = req.params;
  //   const { name, name_vi, sub_name, icon_name, icon_component } = req.body;
  //   try {
  //     const categoryChange = await category.findOne({ _id: id });
  //     if (!categoryChange) return res.json({ success: false, message: 'Danh mục không tồn tại' });

  //     let categoryChangeCondition = {
  //       name,
  //       name_vi,
  //       sub_name,
  //       icon_name,
  //       icon_component,
  //     };

  //     const change = await category.findOneAndUpdate({ _id: id }, categoryChangeCondition, { new: true });

  //     if (!change) return res.json({ success: false, message: 'Thay đổi không thành công' });

  //     res.json({ success: true, message: 'Thay đổi thành công', id, category: change });
  //   } catch (error) {
  //     console.log(e);
  //     res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
  //   }
  // }

  async deletePackage(req, res) {
    const { id } = req.params;
    try {
      const packageDelete = await category.findOneAndDelete({ _id: id });
      if (!packageDelete) return res.json({ success: false, message: 'Đơn hàng không tồn tại' });
      res.json({ success: true, message: 'Xóa thành công', id, package_delete: packageDelete });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
    }
  }
}

export default new packageControlller();