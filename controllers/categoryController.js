import category from '../models/category';

class categoryControlller {
  async getCategory(req, res) {
    try {
      const categorys = await category.find({});
      if (!categorys) {
        return res.status(403).json({ success: false, message: 'Không có dữ liệu danh mục', categorys });
      }
      res.json({ success: true, message: 'Tải dữ liệu danh mục thành công', categorys });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
    }
  }

  async createCategory(req, res) {
    const { name, name_vi, sub_name, icon_name, icon_component } = req.body;
    if (!name) return res.status(403).json({ success: false, message: 'Tên danh mục chưa được nhập' });

    try {
      const newCategory = new category({
        name,
        name_vi,
        sub_name,
        icon_name,
        icon_component,
      });
      await newCategory.save();
      res.json({ success: true, message: 'Danh mục đã được tạo', category: newCategory });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
    }
  }

  async editCategory(req, res) {
    const { id } = req.params;
    const { name, name_vi, sub_name, icon_name, icon_component } = req.body;
    try {
      const categoryChange = await category.findOne({ _id: id });
      if (!categoryChange) return res.json({ success: false, message: 'Danh mục không tồn tại' });

      let categoryChangeCondition = {
        name,
        name_vi,
        sub_name,
        icon_name,
        icon_component,
      };

      const change = await category.findOneAndUpdate({ _id: id }, categoryChangeCondition, { new: true });

      if (!change) return res.json({ success: false, message: 'Thay đổi không thành công' });

      res.json({ success: true, message: 'Thay đổi thành công', id, category: change });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
    }
  }

  async deleteCategory(req, res) {
    const { id } = req.params;
    try {
      const categoryDelete = await category.findOneAndDelete({ _id: id });
      if (!categoryDelete) return res.json({ success: false, message: 'Danh mục không tồn tại' });
      res.json({ success: true, message: 'Xóa thành công', id, category: categoryDelete });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
    }
  }
}

export default new categoryControlller();
