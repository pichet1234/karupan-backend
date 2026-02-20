var mongoose = require('../connect');//เชื่อมต่อฐานข้อมูล
var Schema = mongoose.Schema;
var financeLogsSchema = new mongoose.Schema({
    borrowid: { type: Schema.Types.ObjectId, ref: 'borrow' },//อ้างอิง borrow
    borrowdetailid: { type: Schema.Types.ObjectId, ref: 'borrow_details' },//อ้างอิง borrow_details
      status: {
    type: String,
    enum: ['borrowed', 'returned'],
    default: 'borrowed'
    }, // สถานะการทำรายการ
    depositReceived: { type: Number, default: 0   },// เงินที่รับจากผู้ยืม
    refundPaid: { type: Number,default: 0  }, // เงินที่คืนให้ผู้ยืม
    deductedAmount: { type: Number, default: 0 },// เงินที่หักไว้ถาวร
    createdAt: { type: Date, default: Date.now },//วันที่ทำรายการ
    note: String//หมายเหตุ
}, { collection: 'financelogs' });

module.exports = mongoose.model('financelogs', financeLogsSchema);