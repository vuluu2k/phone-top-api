import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const blogSchema = new Schema(
  {
    title: { type: String, required: true },
    image_id: { type: String, required: true },
    image_link: { type: String, required: true },
    type: { type: String, default: 'home' },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('blog', blogSchema);
