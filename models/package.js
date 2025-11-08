const mongoose = require('mongoose');
const { Schema } = mongoose;

const packageSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'auth' },
    full_name: { type: String, required: true },
    phone_number: { type: Number, required: true },
    email: { type: String },
    products: Array,
    current_status_vi: { type: String, default: 'Đơn mới' },
    current_status_en: { type: String, default: 'new' },
    isRequest: { note: String, isTrash: Boolean },
    note: String,
    value: Number,
    is_pay: String,
    cod: Number,
    isAccess: { type: Boolean, default: false },
    zalopay_transaction: {
      app_trans_id: String,
      zp_trans_id: String,
      amount: Number,
      status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
      created_at: { type: Date },
      completed_at: { type: Date },
    },
    historys: [
      {
        note: String,
        status_vi: { type: String, default: 'Đơn mới' },
        status_en: { type: String, default: 'new' },
        createdAt: { type: Date, default: new Date() },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('package', packageSchema);
