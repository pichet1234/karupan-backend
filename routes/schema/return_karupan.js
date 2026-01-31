var mongoose = require('../connect');//เชื่อมต่อฐานข้อมูล
const Schema = mongoose.Schema;
var returnKarupanSchema = new mongoose.Schema({
    borrow_id:{ type: Schema.Types.ObjectId, ref: 'borrow' , required: true},
    karupanid:{ type: Schema.Types.ObjectId, ref: 'karupans' , required: true},
    return_date: Date,
    receiver_id:String,//ผู้รับคืน
    note:String,
    deposit: Number
},{ collection: 'return_karupan'});
module.exports = mongoose.model('return_karupan', returnKarupanSchema);