import packages from '../models/package';

class packageControlller {
  async getPackage(req, res) {
    try {
      const view_package = await packages.find({});
      if (!view_package) {
        return res.json({ success: false, message: 'Không có dữ liệu danh mục', view_package });
      }
      res.json({ success: true, message: 'Tải dữ liệu danh mục thành công', view_package });
    } catch (error) {
      console.log(e);
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
        historys: [{ status_vi: 'Đơn mới', status_en: 'new', note: 'Bạn có một đơn mới' }],
      });
      await newPackage.save();
      res.json({ success: true, message: 'Bạn có một đơn hàng mới', package: newPackage });
    } catch (error) {
      console.log(e);
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

  // async deleteCategory(req, res) {
  //   const { id } = req.params;
  //   try {
  //     const categoryDelete = await category.findOneAndDelete({ _id: id });
  //     if (!categoryDelete) return res.json({ success: false, message: 'Danh mục không tồn tại' });
  //     res.json({ success: true, message: 'Xóa thành công', id, category: categoryDelete });
  //   } catch (error) {
  //     console.log(e);
  //     res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
  //   }
  // }
}

export default new packageControlller();
