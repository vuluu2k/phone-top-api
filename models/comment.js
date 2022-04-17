import mongoose from 'mongoose';
const { Schema } = mongoose;

const commentSchema = new Schema(
  {
    name: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'auth' },
    content: { type: String, required: true },
    mode: { type: String, default: 'customer' },
  },
  { timestamps: true }
);

export default mongoose.model('comment', commentSchema);
