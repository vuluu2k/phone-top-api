const mongoose = require('mongoose');
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

module.exports = mongoose.model('category', categorySchema);
