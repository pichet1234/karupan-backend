var express = require('express');
var router = express.Router();
var karupanType = require('./controller/karupanType');

router.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200'); // ระบุ origin ให้ชัดเจน
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/addkarupanType', (req, res,next)=> { karupanType.addkarupanType(req, res); });//เพิ่มประเภทครุภัณฑ์

module.exports = router;
