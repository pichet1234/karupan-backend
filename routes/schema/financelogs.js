var mongoose = require('../connect');//เชื่อมต่อฐานข้อมูล
var Schema = mongoose.Schema;
var financeLogsSchema = new mongoose.Schema({
    borrowid: { type: Schema.Types.ObjectId, ref: 'borrow' },//อ้างอิง borrow
    borrowdetailid: { type: Schema.Types.ObjectId, ref: 'borrow_details' },//อ้างอิง borrow_details
    type: String ,//ประเภท รายรับ หรือ รายจ่าย
    amount: Number,//จำนวนเงิน
    createdAt: { type: Date, default: Date.now },//วันที่ทำรายการ
    note: String//หมายเหตุ
},{ collection: 'financelogs'});

module.exports = mongoose.model('financelogs', financeLogsSchema);