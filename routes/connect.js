const mongoose = require('mongoose');
  // [เครื่อง รพสต. password:pichet002] [เรื่องที่บ้าน password:pichet68]
  //Cloud MongoDB
mongoose.connect('mongodb+srv://admin:Pichet0026@cluster0.aqwh1hu.mongodb.net/', {
  authSource: 'admin' // ระบุฐานข้อมูลที่ใช้ตรวจสอบสิทธิ์
})
.then(() => {
  console.log('Connected to database karupanDB');
})
.catch((error) => {
  console.log('Error connecting to database karupanDB', error);
});

module.exports = mongoose; 