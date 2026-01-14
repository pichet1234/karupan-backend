var mongoose = require('../connect');
const Schema = mongoose.Schema;
var borrowdetailsSchema = new mongoose.Schema({
    borrowid: {
        type: Schema.Types.ObjectId,
        ref: 'borrow',          // ← ชื่อ model ที่อ้างอิง
        required: true
    },
    karupanid: {
        type: Schema.Types.ObjectId, ref: 'karupans', required: true 
    },
    kname: String,
    karupuncode: String,
    statuskarupan: String,
    diposit: Number,
},{ collection: 'borrow_details'});

module.exports = mongoose.model('borrow_details', borrowdetailsSchema);