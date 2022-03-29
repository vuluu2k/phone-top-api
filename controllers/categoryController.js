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
      console.log(e);
      res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
    }
  }

  async createCategory(req, res) {
    const { name } = req.body;
    if (!name) return res.status(403).json({ success: false, message: 'Tên danh mục chưa được nhập' });

    try {
      const newCategory = new category({
        name,
      });
      await newCategory.save();
      res.json({ success: true, message: 'Danh mục đã được tạo', category: newCategory });
    } catch (error) {
      console.log(e);
      res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
    }
  }
}

export default new categoryControlller();
