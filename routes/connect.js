const mongoose = require('mongoose');

mongoose.connect('mongodb://superadmin:pichet68@localhost:27017/karupanDB', {
  authSource: 'admin' // ระบุฐานข้อมูลที่ใช้ตรวจสอบสิทธิ์
})
.then(() => {
  console.log('Connected to database karupanDB');
})
.catch((error) => {
  console.log('Error connecting to database karupanDB', error);
});

