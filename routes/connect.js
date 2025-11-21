const mongoose = require('mongoose');
  //เครื่อง รพสต. pichet002 เครื่องที่บ้าน pichet68
mongoose.connect('mongodb://superadmin:pichet002@localhost:27017/karupanDB', {
  authSource: 'admin' // ระบุฐานข้อมูลที่ใช้ตรวจสอบสิทธิ์
})
.then(() => {
  console.log('Connected to database karupanDB');
})
.catch((error) => {
  console.log('Error connecting to database karupanDB', error);
});

