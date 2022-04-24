import blog from '../models/blog';
import { cloudinaryV2 } from '../utils/cloudinary';

class blogController {
  async createBlog(req, res) {
    const { title, image, type, description } = req.body;

    if (!title || !image || !description) {
      return res.json({ success: false, message: 'Bạn bỏ quên một số trường nhập bắt buộc' });
    }

    try {
      const image_response = await cloudinaryV2.uploader.upload(image, {
        upload_preset: 'PhoneTopBlog',
        eager: { width: 2134, height: 1200, crop: 'pad' },
      });
      const newBlog = new blog({
        title,
        type,
        image_id: image_response.public_id,
        image_link: image_response.eager[0].url,
        description,
      });

      await newBlog.save();

      res.json({ success: true, message: 'Tạo thành công!', blog: newBlog });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
    }
  }

  async getBlog(req, res) {
    const { title, type, page_number = 1, page_size = 20 } = req.query;

    try {
      const listBlog = await blog
        .find({
          $and: [(title && title !== String(undefined) && { title }) || {}, (type && type !== String(undefined) && { type }) || {}],
        })
        .limit(page_size * 1)
        .skip((page_number - 1) * page_size)
        .sort({ updatedAt: 'desc' });

      const blogLength = await (await blog.find({})).length;

      const page_entries = blogLength / page_size;
      const page_totals = blogLength;

      if (!listBlog) {
        return res.json({ success: false, message: 'Danh sách trống!' });
      }
      return res.json({
        success: true,
        message: 'Thành công tải lên danh sách',
        blogs: listBlog,
        page_size,
        page_number,
        page_entries,
        page_totals,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
    }
  }

  async editBlog(req, res) {
    const { blog_id, title, image, type, description } = req.body;

    if (!blog_id) {
      return res.json({ success: false, message: 'Có lỗi về mặt dữ liệu khi bắn lên Server' });
    }

    try {
      const blog_with_id = await blog.findById({ _id: blog_id });
      const image_response = await cloudinaryV2.uploader.upload(image, {
        public_id: blog_with_id.image_id,
        overwrite: true,
        eager: { width: 2134, height: 1200, crop: 'pad' },
      });

      let blog_change = {
        title,
        type,
        image_id: image_response.public_id,
        image_link: image_response.eager[0].url,
        description,
      };

      const editBlog = await blog.findOneAndUpdate({ _id: blog_id }, blog_change, { new: true });
      if (!editBlog) {
        return res.json({ success: false, message: 'Cập nhật thất bại' });
      }
      res.json({ success: true, message: 'Cập nhật thành công', blog: editBlog });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
    }
  }

  async deleteBlog(req, res) {
    const { id } = req.params;
    if (!id) {
      return res.json({ success: false, message: 'Mã sản phẩm không tồn tại' });
    }

    try {
      const deleteBlog = await blog.findOneAndDelete({ _id: id });

      if (!deleteBlog) {
        return res.json({ success: false, message: 'Sản phẩm không tồn tại' });
      }

      await cloudinaryV2.uploader.destroy(`${deleteBlog.image_id}`);
      res.json({ success: true, message: 'Xóa thành công', blog: deleteBlog });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
    }
  }
}

export default new blogController();
