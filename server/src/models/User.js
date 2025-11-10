//updated
// src/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    trim: true, 
    required: true 
},
  phone: { 
    type: String, 
    trim: true, 
    required: true, 
    unique: true 
}, // keep unique phone
  email: { 
    type: String, 
    trim: true, 
    default: null 
}, // optional email
  password: { 
    type: String, 
    required: true 
},
  role: { 
    type: String, 
    enum: ['farmer', 'buyer'], 
    required: true 
},
}, { timestamps: true });

// create unique index only for phone
userSchema.index({ phone: 1 }, { unique: true });

// DO NOT call userSchema.index({ email: 1 }) or use { unique: true } on email
module.exports = mongoose.model('User', userSchema);
