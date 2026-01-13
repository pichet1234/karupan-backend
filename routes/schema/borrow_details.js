var mongoose = require('../connect');
const Schema = mongoose.Schema;
var borrowdetailsSchema = new mongoose.Schema({
    borrow_id: {
        type: Schema.Types.ObjectId,
        ref: 'borrow',          // ← ชื่อ model ที่อ้างอิง
        required: true
    },
    karupan_id: {
        type: Schema.Types.ObjectId, ref: 'karupans', required: true 
    },
    statusBorw: String,
    diposit: Number,
},{ collection: 'borrow_details'});

module.exports = mongoose.model('borrow_details', borrowdetailsSchema);