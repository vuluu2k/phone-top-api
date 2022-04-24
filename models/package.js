import mongoose from 'mongoose';
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
    note: String,
    value: Number,
    is_pay: String,
    isAccess: { type: Boolean, default: false },
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

export default mongoose.model('package', packageSchema);
