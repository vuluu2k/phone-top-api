import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const cartSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'auth' },
    products: [
      {
        product_id: { type: Schema.Types.ObjectId, ref: 'product' },
        quantity: { type: Number },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('cart', cartSchema);
