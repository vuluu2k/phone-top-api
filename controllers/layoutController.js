const layout = require('../models/layout');
const { cloudinaryV2 } = require('../utils/cloudinary');

class layoutControlller {
  async getLayout(req, res) {
    try {
      const layouts = await layout.find({});
      if (!layouts) {
        return res.status(403).json({ success: false, message: 'Không có dữ liệu', layouts });
      }
      res.json({ success: true, message: 'Tải dữ liệu thành công', layouts });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
    }
  }

  async createLayout(req, res) {
    const { position, image } = req.body;
    if (!image) return res.status(403).json({ success: false, message: 'Chưa nhập ảnh' });

    try {
      const image_response = await cloudinaryV2.uploader.upload(image, {
        eager: { width: 1380, height: 600, crop: 'fill', fetch_format: 'auto' },
      });
      const newImage = new layout({
        position,
        image_id: image_response.public_id,
        image_link: image_response.eager[0].url,
      });
      await newImage.save();
      res.json({ success: true, message: 'Thêm thành công', layout: newImage });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
    }
  }

  async editLayout(req, res) {
    const { layout_id, position, image } = req.body;
    if (!image) return res.status(403).json({ success: false, message: 'Chưa nhập ảnh' });

    try {
      const layout_with_id = await layout.findById({ _id: layout_id });
      const image_response = await cloudinaryV2.uploader.upload(image, {
        public_id: layout_with_id.image_id,
        overwrite: true,
        eager: { width: 1380, height: 600, crop: 'fill', fetch_format: 'auto' },
      });
      const editImage = new {
        position,
        image_id: image_response.public_id,
        image_link: image_response.eager[0].url,
      }();
      const editImageSuccess = await layout.findOneAndUpdate({ _id: layout_id }, product_change, { new: true });
      if (!editImageSuccess) {
        return res.json({ success: false, message: 'Cập nhật thất bại' });
      }
      res.json({ success: true, message: 'Cập nhật thành công', layout: editImageSuccess });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
    }
  }

  async deleteLayout(req, res) {
    const { id } = req.params;
    try {
      const layoutDelete = await layout.findOneAndDelete({ _id: id });
      if (!layoutDelete) return res.json({ success: false, message: 'Xóa thất bại' });
      res.json({ success: true, message: 'Xóa thành công', id, layout: layoutDelete });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
    }
  }
}

module.exports = new layoutControlller();
