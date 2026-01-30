var mongoose = require('../connect');
var Schema = mongoose.Schema;
var borrowSchema = new mongoose.Schema({
    borrow_date: Date,
    person_id: { type: Schema.Types.ObjectId, ref: 'person' },
    patient: String,
    user_id: String,
    address: {
        bannumber: String,
        moo: String,
        village: String,
        tambon: String
    },
    expenses: Number,
    details: String,
    remark: String,
    return_date: {
         type: Date
    },
    countn:Number,//นับจำนวนที่ยืม
    statusborrow: String
},{ collection: 'borrow'});

module.exports = mongoose.model('borrow', borrowSchema);