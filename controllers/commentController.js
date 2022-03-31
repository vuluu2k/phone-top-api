import product from '../models/product';

class commentController {
  async createComment(req, res) {
    const { name, value, image, status, quantity, category } = req.body;
    if (!name || !value || !type || !author) {
      return res.status(403).json({ success: false, message: 'Bạn bỏ quên một số trường nhập bắt buộc' });
    }

    try {
      const image_response = await cloudinaryV2.uploader.upload(image, {
        upload_preset: 'Book_Dev',
        eager: { width: 900, height: 500, crop: 'pad' },
      });
      const newProduct = new product({
        name,
        value,
        status,
        quantity,
        category,
        image_id: image_response.public_id,
        image_link: image_response.eager[0].url,
      });

      await newProduct.save();

      res.json({ success: true, message: 'Tạo thành công!', product: newProduct });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
    }
  }

  async getComment(req, res) {
    const { product_id, name, value, status, category, page_number = 1, page_size = 10 } = req.query;

    try {
      const listProduct = await book
        .find({
          $and: [
            (product_id && product_id !== String(null) && product_id !== String(undefined) && { _id: product_id }) || {},
            (name && name !== String(undefined) && { name }) || {},
            (value && value !== String(undefined) && { value }) || {},
            (status && status !== String(undefined) && { status }) || {},
            (category && category !== String(undefined) && { category }) || {},
          ],
        })
        .limit(page_size * 1)
        .skip((page_number - 1) * page_size);

      const productLength = await (await product.find({})).length;

      const page_entries = productLength / page_size;
      const page_totals = productLength;

      if (!listProduct) {
        return res.status(403).json({ success: false, message: 'Danh sách trống!' });
      }
      return res.json({
        success: true,
        message: 'Thành công tải lên danh sách',
        products: listProduct,
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

  async editComment(req, res) {
    const { book_id } = req.query;
    const { name, value, type, author, quantity, producer, image } = req.body;

    if (!book_id) {
      return res.status(403).json({ success: false, message: 'Sách không tồn tại' });
    }

    try {
      const book_with_id = await book.findById({ _id: book_id });
      const image_response = await cloudinaryV2.uploader.upload(image, {
        public_id: book_with_id.image_id,
        overwrite: true,
        eager: { width: 900, height: 500, crop: 'pad' },
      });

      let book_change = {
        name,
        value,
        type_of_book: type,
        author_of_book: author,
        quantity,
        producer,
        image_id: image_response.public_id,
        image_link: image_response.eager[0].url,
      };

      const editBook = await book.findOneAndUpdate({ _id: book_id }, book_change, { new: true });
      if (!editBook) {
        return res.status(401).json({ success: false, message: 'Sách không tồn tại' });
      }
      res.json({ success: true, message: 'Cập nhật thành công', book: editBook });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
    }
  }

  async deleteComment(req, res) {
    const { book_id } = req.query;
    if (!book_id) {
      return res.status(403).json({ success: false, message: 'Sách không tồn tại' });
    }

    try {
      const deleteBook = await book.findOneAndDelete({ _id: book_id });

      if (!deleteBook) {
        return res.status(403).json({ success: false, message: 'Sách không tồn tại' });
      }

      await cloudinaryV2.uploader.destroy(`${deleteBook.image_id}`);
      res.json({ success: true, message: 'Xóa thành công', book: deleteBook });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
    }
  }
}

export default new commentController();
