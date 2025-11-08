const packages = require('../models/package');
const zalopay = require('../utils/zalopay');

class PaymentController {
  /**
   * Create a ZaloPay payment
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async createZaloPayPayment(req, res) {
    const { package_id, amount } = req.body;
    
    if (!package_id || !amount) {
      return res.status(400).json({ 
        success: false, 
        message: 'Thiếu thông tin thanh toán' 
      });
    }

    try {
      // Get package information
      const packageInfo = await packages.findOne({ _id: package_id });
      
      if (!packageInfo) {
        return res.status(404).json({ 
          success: false, 
          message: 'Không tìm thấy đơn hàng' 
        });
      }

      // Generate transaction ID
      const app_trans_id = zalopay.generateTransactionId();
      
      // Create order data
      const orderData = {
        app_trans_id,
        amount: parseInt(amount),
        description: `Thanh toán đơn hàng #${package_id}`,
        package_id
      };

      // Create ZaloPay order
      const zaloPayOrder = await zalopay.createOrder(orderData);
      
      if (zaloPayOrder.return_code === 1) {
        // Update package with ZaloPay transaction information 
        await packages.findOneAndUpdate(
          { _id: package_id },
          { 
            zalopay_transaction: {
              app_trans_id,
              amount: parseInt(amount),
              status: 'pending',
              created_at: new Date()
            }
          },
          { new: true }
        );

        return res.json({
          success: true,
          message: 'Tạo đơn thanh toán ZaloPay thành công',
          data: {
            order_url: zaloPayOrder.order_url,
            app_trans_id,
            zp_trans_token: zaloPayOrder.zp_trans_token
          }
        });
      } else {
        return res.status(400).json({
          success: false,
          message: 'Tạo đơn thanh toán ZaloPay thất bại',
          error: zaloPayOrder.return_message
        });
      }
    } catch (error) {
      console.error('ZaloPay payment error:', error);
      res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
    }
  }

  /**
   * Handle ZaloPay callback - Chỉ cần khi bạn muốn xử lý callback từ ZaloPay
   * 
   * Lưu ý: Để sử dụng hàm này, bạn cần:
   * 1. Có một URL callback có thể truy cập được từ internet (có thể dùng ngrok khi phát triển local)
   * 2. Cấu hình URL callback trong ZaloPay Developer Portal
   * 3. Có key2 để xác thực callback
   * 
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async zaloPayCallback(req, res) {
    try {
      const callbackData = req.body;
      
      // Verify callback data
      const isValid = zalopay.verifyCallback(callbackData);
      
      if (!isValid) {
        return res.status(400).json({ 
          return_code: -1, 
          return_message: 'Invalid callback data' 
        });
      }

      // Extract package_id from embed_data
      const embedData = JSON.parse(callbackData.embed_data);
      const package_id = embedData.package_id;
      
      // Update package payment status
      if (callbackData.status === 1) { // Payment successful
        const packageInfo = await packages.findOne({ _id: package_id });
        
        if (packageInfo) {
          // Update package with payment information
          await packages.findOneAndUpdate(
            { _id: package_id },
            {
              isAccess: true,
              current_status_en: 'waiting',
              current_status_vi: 'Chờ lấy hàng',
              is_pay: 'ZaloPay',
              zalopay_transaction: {
                app_trans_id: callbackData.app_trans_id,
                zp_trans_id: callbackData.zp_trans_id,
                amount: callbackData.amount,
                status: 'completed',
                completed_at: new Date()
              },
              historys: packageInfo.historys.concat([
                {
                  status_vi: 'Thanh toán thành công',
                  status_en: 'payment_success',
                  note: 'Đã thanh toán thành công qua ZaloPay',
                  createdAt: Date.now(),
                },
              ]),
            },
            { new: true }
          );
        }
      }

      // Return success to ZaloPay
      return res.json({ 
        return_code: 1, 
        return_message: 'success' 
      });
    } catch (error) {
      console.error('ZaloPay callback error:', error);
      res.status(500).json({ 
        return_code: -1, 
        return_message: 'Internal server error' 
      });
    }
  }

  /**
   * Query ZaloPay order status - Dùng để kiểm tra trạng thái đơn hàng
   * 
   * Hàm này hữu ích khi:
   * 1. Bạn muốn kiểm tra trạng thái thanh toán của đơn hàng
   * 2. Người dùng quay lại từ ZaloPay và bạn muốn xác nhận trạng thái thanh toán
   * 
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  async queryZaloPayStatus(req, res) {
    const { app_trans_id } = req.query;
    
    if (!app_trans_id) {
      return res.status(400).json({ 
        success: false, 
        message: 'Thiếu mã giao dịch' 
      });
    }

    try {
      // Query order status from ZaloPay
      const orderStatus = await zalopay.queryOrderStatus(app_trans_id);
      
      return res.json({
        success: true,
        message: 'Truy vấn trạng thái thanh toán thành công',
        data: orderStatus
      });
    } catch (error) {
      console.error('Query ZaloPay status error:', error);
      res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
    }
  }
}

module.exports = new PaymentController();
