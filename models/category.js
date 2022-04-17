import mongoose from 'mongoose';
const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    name: { type: String, required: true },
    name_vi: String,
    icon_name: String,
    icon_component: String,
    sub_name: Array,
  },
  { timestamps: true }
);

export default mongoose.model('category', categorySchema);
