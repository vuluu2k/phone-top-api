import mongoose from 'mongoose';
const { Schema } = mongoose;

const layoutSchema = new Schema(
  {
    position: { type: String, required: true, default: 'layout' },
    image_id: { type: String, required: true },
    image_link: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('layout', layoutSchema);
