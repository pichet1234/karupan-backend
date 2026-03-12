const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullname: { type: String, required: true },
     email: String,
  position:  String,
  tel: String,
  role: {
    type: String,
    enum: ['superadmin','admin', 'staff', 'viewer'],
    default: 'viewer'
  },
  profileImage: {
    type: String,
    default: "images/profile1.jpg"
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);