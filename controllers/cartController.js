import cart from '../models/cart';
import product from '../models/product';

class cartController {
  async initCart(req, res) {
    const { user_id } = req.body;
    if (!user_id) return res.json({ success: false, message: 'Bạn chưa đăng nhập' });
    try {
      const cart_get = await cart.find({ user_id: user_id });

      if (cart_get.length > 0) return res.json({ success: true, message: 'Giỏ hàng được tải lên thành công', cart: cart_get });

      const initalCart = new cart({
        user_id,
        products: [],
      });

      await initalCart.save();

      res.json({ success: true, message: 'Giỏ hàng được khởi tạo', cart: initalCart });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
    }
  }

  async getCart(req, res) {
    const { user_id } = req.query;
    if (!user_id) return res.json({ success: false, message: 'Bạn chưa đăng nhập' });
    try {
      const cart_get = await cart.find({ user_id: user_id });
      if (!cart_get) return res.json({ success: false, message: 'Giỏ hàng chưa được tạo kiểm tra lại tài khoản của bạn' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
    }
  }

  async changeCart(req, res) {
    const { products, user_id } = req.body;
    if (!user_id) return res.json({ success: false, message: 'Bạn chưa đăng nhập' });
    try {
      const cart_add = {
        user_id,
        products,
      };

      const find = await cart.findOne({ user_id: user_id });

      console.log(find);

      const changeCart = await cart.findOneAndUpdate({ user_id: user_id }, cart_add, { new: true });

      if (!changeCart) return res.json({ success: false, message: 'Thay đổi giỏ hàng không thành công' });

      res.json({ success: true, message: 'Thay đổi thành công', cart: cart_add });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
    }
  }
}

export default new cartController();
