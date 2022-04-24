// auth Controllers

import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

import auth from '../models/auth';

class authController {
  async createAuth(req, res) {
    const { name, password, email, role, role_name, phone_number, full_name } = req.body;
    if (!name || !password) return res.json({ success: false, message: 'Bạn chưa nhập tài khoản/ mật khẩu' });
    try {
      const authName = await auth.findOne({ name });
      if (authName) return res.json({ success: false, message: 'Tên người dùng đã tồn tại' });

      const hashedPassword = await argon2.hash(password);

      const newUser = new auth({
        name,
        password: hashedPassword,
        email,
        role,
        role_name,
        phone_number,
        full_name,
      });
      await newUser.save();
      const accessToken = jwt.sign({ authId: newUser._id }, process.env.ACCESS_TOKEN_SECRET);
      return res.json({ success: true, message: 'Tạo tài khoản thành công', accessToken });
    } catch (e) {
      console.log(e);
      res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
    }
  }

  async loginAuth(req, res) {
    const { name, password } = req.body;

    if (!name || !password) return res.status(400).json({ success: false, message: 'Bạn chưa nhập tài khoản/ mật khẩu' });

    try {
      const authFind = await auth.findOne({ name });
      if (!authFind) return res.json({ success: false, message: 'Tài khoản hoặc mật khẩu không chính xác' });

      const passwordValid = await argon2.verify(authFind.password, password);
      if (!passwordValid) return res.json({ success: false, message: 'Tài khoản hoặc mật khẩu không chính xác' });

      const accessToken = jwt.sign({ authId: authFind._id }, process.env.ACCESS_TOKEN_SECRET);
      res.json({ success: true, message: 'Đăng nhập thành công', accessToken });
    } catch (e) {
      console.log(e);
      res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
    }
  }

  async checkAuth(req, res) {
    try {
      const auth_check = await auth.findById(req.authId).select('-password');
      if (!auth_check) return res.json({ success: false, message: 'Không tìm thấy tài khoản' });
      res.json({ success: true, message: 'Thông tin được tải lên thành công', user: auth_check });
    } catch (e) {
      console.log(e);
      res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
    }
  }

  async getAuth(req, res) {
    const { name } = req.query;

    try {
      const auths = await auth.find((name && name !== String(undefined) && { name: { $regex: name, $options: 'i' } }) || {});
      res.json({ success: true, message: 'Tải danh sách thành công', auths: auths });
    } catch (e) {
      console.log(e);
      res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
    }
  }

  async editAuth(req, res) {
    const { user_id, email, phone_number, full_name, password, change_password, new_password } = req.body;

    if (!user_id) return res.json({ success: false, message: 'Chưa đăng nhập' });
    try {
      const userFind = await auth.findOne({ _id: user_id });
      if (!userFind) return res.json({ success: false, message: 'Tài khoản này không tồn tại' });

      if (change_password) {
        const passwordValid = await argon2.verify(userFind.password, password);
        if (!passwordValid) return res.json({ success: false, message: 'Mật khẩu cũ không chính xác' });
      }

      let editUser = {
        password: (new_password && (await argon2.hash(new_password))) || userFind.password,
        email,
        phone_number,
        full_name,
      };

      const userChange = await auth.findOneAndUpdate({ _id: user_id }, editUser, { new: true });

      if (!userChange) return res.json({ success: false, message: 'Thay đổi thất bại' });
      res.json({ success: true, message: 'Thay đổi thành công', user: userChange });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
    }
  }

  async deleteUser(req, res) {
    const { id } = req.params;
    if (!id) {
      return res.json({ success: false, message: 'Không có nickname trong cửa hàng của bạn' });
    }

    try {
      const deleteUser = await auth.findOneAndDelete({ _id: id });
      if (!deleteUser) {
        return res.json({ success: false, message: 'Tên tài khoản không tồn tại' });
      }

      res.json({ success: true, message: 'Xóa thành công', user: deleteUser });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
    }
  }
}

export default new authController();
