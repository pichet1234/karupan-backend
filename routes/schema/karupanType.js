var mongoose = require('../connect');//เชื่อมต่อฐานข้อมูล
var karupantypeSchema = new mongoose.Schema({
    karupanType:String,
    details:String
},{ collection: 'karupanType' });

module.exports = karupantypeSchema;