const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const authSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    full_name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone_number: { type: String, required: true },
    email: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      default: 0,
    },
    role_name: {
      type: String,
      default: 'customer',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('auth', authSchema);
