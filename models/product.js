import mongoose from 'mongoose';
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    value: { type: Number, required: true },
    image_id: { type: String, required: true },
    image_link: { type: String, required: true },
    status: { type: String, required: true, default: 'new' },
    quantity: { type: Number, required: true },
    cout_buy: { type: Number, default: 0 },
    category: { type: Schema.Types.ObjectId, ref: 'category' },
    options: [
      {
        name: String,
        value: Number,
        image_id: String,
        image_link: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('product', productSchema);
