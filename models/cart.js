import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const cartSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'auth' },
    products: [
      {
        product_id: { type: Schema.Types.ObjectId, ref: 'product' },
        quantity: { type: Number, default: 1 },
        name: String,
        image_link: String,
        name_option: String,
        value_option: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('cart', cartSchema);
