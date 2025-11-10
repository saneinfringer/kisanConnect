const mongoose = require('mongoose');

const CropSchema = new mongoose.Schema({
//   owner: {
//   type: mongoose.Schema.Types.ObjectId,
//   ref: 'User',
//   required: false, // make true if every crop must belong to a user
//  },

  name: {
    type: String,
    required: [true, 'Crop name is required'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative'],
  },
  location: {
    type: String,
    default: '',
    trim: true,
  },
  contactNumber: {
    type: String,
    default: '',
    trim: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Crop', CropSchema);
