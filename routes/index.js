var express = require('express');
var router = express.Router();
const path = require('path');
const fs = require('fs');  
const multer = require('multer');

var karupanType = require('./controller/karupanType');
var karupans = require('./controller/karupans');
var person = require('./controller/person');
var borrow = require('./controller/borrow');
var borrowdetails = require('./controller/borrow_details');

router.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*'); // ระบุ origin ให้ชัดเจน
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
const uploadDir = path.join(__dirname, '..', 'uploads');
// __dirname = routes/

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // ดึงนามสกุลไฟล์
    const ext = path.extname(file.originalname).toLowerCase();

    // ตั้งชื่อใหม่ (ไม่ซ้ำ + ไม่มีภาษาไทย)
    const newName =
      Date.now() +
      '-' +
      Math.round(Math.random() * 1e9) +
      ext;

    cb(null, newName);
  }
});
const upload = multer({ storage });

router.post('/addkarupanType', (req, res,next)=> { karupanType.addkarupanType(req, res); });//เพิ่มประเภทครุภัณฑ์
router.get('/getkarupan', (req, res) => { karupanType.getkarupan(req, res); });//ดึงข้อมูลประเภทครุภัณฑ์
router.get('/getkarupanborrow', (req, res,next) => { karupans.getKarupan(req, res); });//ดึงข้อมูลครุภัณฑ์เฉพราะที่สามารถยืมได้

router.post('/addkarupans', upload.single('file'), (req, res, next) => {
  karupans.addkarupans(req, res);
});
router.post('/donatekarupan', upload.single('file'), (req, res, next) => { karupans.donatekarupan(req, res); });
router.post('/addPersonnel', (req, res, next) => { person.addPerson(req, res); }); //เพิ่มบุคคลติดต่อ
router.post('/addborrow', (req, res, next) => { borrow.addBorrow(req, res); }); //เพิ่มการยืมครุภัณฑ์
router.post('/borrowdetails', (req, res, next)=> { borrowdetails.addBorrowDetails(req, res); });//เพิ่มรายละเอียดการยืมครุภัณฑ์
router.get('/getkarupanall', (req, res, next) => { karupans.getkarupanall(req, res); });//ดึงข้อมูลครุภัณฑ์ทั้งหมด
router.get('/countkarupanall', (req, res, next) => { karupans.countkarupanall(req, res); });//นับจำนวนครุภัณฑ์ทั้งหมด
router.get('/countkarupanstatus', (req, res, next) => { karupans.countkpssucess(req, res); });
router.get('/countkarupandanger', (req, res, next)=> { karupans.countkpsdanger(req, res); });
router.get('/getallborrows', (req, res, next) => { borrow.getAllBorrows(req, res); });//ดึงข้อมูลการยืมครุภัณฑ์ทั้งหมด
router.post('/returnborrow', (req, res, next)=> { borrowdetails.returnBorrow(req, res); });//คืนครุภัณฑ์

module.exports = router;
