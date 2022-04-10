import mongoose from 'mongoose';
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    value: { type: Number, required: true },
    image_id: { type: String, required: true },
    image_link: { type: String, required: true },
    status: { type: String, required: true, default: 'new' },
    quantity: { type: Number, required: true, default: 1 },
    cout_buy: { type: Number, default: 0 },
    category: { type: Schema.Types.ObjectId, ref: 'category', default: 'other' },
    sub_category: String,
    options: [
      {
        name_options: String,
        value_options: Number,
        image_id: String,
        image_link: String,
      },
    ],
    profile: {
      screen_size: String,
      screen_technology: String,
      camera_font: String,
      camera_back: String,
      chipset: String,
      ram_capacity: Number,
      rom_capacity: Number,
      baterry: Number,
      sim_card: String,
      os: String,
      screen_pixel: String,
      weight: Number,
      bluetooth: String,
      scan_frequency: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model('product', productSchema);
