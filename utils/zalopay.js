const crypto = require('crypto');
const axios = require('axios');
const dayjs = require('dayjs');
require('dotenv').config();

// ZaloPay configuration
const config = {
  app_id: process.env.ZALOPAY_APP_ID,
  key1: process.env.ZALOPAY_KEY1,
  key2: process.env.ZALOPAY_KEY2,
  endpoint: process.env.ZALOPAY_ENDPOINT || 'https://sb-openapi.zalopay.vn/v2',
  callback_url: process.env.ZALOPAY_CALLBACK_URL || 'https://your-domain.com/api/payment/zalopay-callback',
  redirect_url: process.env.ZALOPAY_REDIRECT_URL || 'https://your-domain.com/checkout/success',
};

/**
 * Create a ZaloPay order
 * @param {Object} orderData - Order data
 * @param {string} orderData.app_trans_id - Unique transaction ID
 * @param {number} orderData.amount - Amount to pay
 * @param {string} orderData.description - Order description
 * @param {string} orderData.package_id - Package ID
 * @returns {Promise<Object>} - ZaloPay order data
 */
const createOrder = async (orderData) => {
  try {
    const { app_trans_id, amount, description, package_id } = orderData;
    
    // Create embed data
    const embedData = {
      package_id,
      redirecturl: config.redirect_url,
    };

    // Create order data
    const order = {
      app_id: config.app_id,
      app_trans_id,
      app_user: 'user_' + Math.floor(Math.random() * 1000000),
      app_time: Date.now(),
      amount: parseInt(amount),
      description,
      bank_code: 'zalopayapp',
      item: JSON.stringify([]),
      embed_data: JSON.stringify(embedData),
      callback_url: config.callback_url,
    };

    // Create MAC (Message Authentication Code)
    const data = config.app_id + "|" + order.app_trans_id + "|" + order.app_user + "|" + order.amount + "|" + 
                order.app_time + "|" + order.embed_data + "|" + order.item;
    order.mac = crypto.createHmac('sha256', config.key1).update(data).digest('hex');

    // Call ZaloPay API to create order
    const response = await axios.post(`${config.endpoint}/create`, order);
    
    return response.data;
  } catch (error) {
    console.error('ZaloPay createOrder error:', error);
    throw error;
  }
};

/**
 * Verify ZaloPay callback
 * @param {Object} data - Callback data from ZaloPay
 * @returns {boolean} - Is valid callback
 */
const verifyCallback = (data) => {
  try {
    const { app_id, app_trans_id, amount, embed_data, mac } = data;
    
    // Verify MAC
    const dataStr = app_id + "|" + app_trans_id + "|" + amount + "|" + embed_data;
    const calculatedMac = crypto.createHmac('sha256', config.key2).update(dataStr).digest('hex');
    
    return calculatedMac === mac;
  } catch (error) {
    console.error('ZaloPay verifyCallback error:', error);
    return false;
  }
};

/**
 * Query order status
 * @param {string} app_trans_id - Transaction ID
 * @returns {Promise<Object>} - Order status
 */
const queryOrderStatus = async (app_trans_id) => {
  try {
    const data = {
      app_id: config.app_id,
      app_trans_id,
    };
    
    // Create MAC
    const dataStr = config.app_id + "|" + app_trans_id + "|" + config.key1;
    data.mac = crypto.createHmac('sha256', config.key1).update(dataStr).digest('hex');
    
    // Call ZaloPay API to query order status
    const response = await axios.post(`${config.endpoint}/query`, data);
    
    return response.data;
  } catch (error) {
    console.error('ZaloPay queryOrderStatus error:', error);
    throw error;
  }
};

/**
 * Generate unique transaction ID
 * @returns {string} - Unique transaction ID
 */
const generateTransactionId = () => {
  const timestamp = dayjs().format('YYMMDDHHmmss');
  const randomNum = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `${timestamp}${randomNum}`;
};

module.exports = {
  createOrder,
  verifyCallback,
  queryOrderStatus,
  generateTransactionId,
};
