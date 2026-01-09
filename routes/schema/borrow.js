var mongoose = require('../connect');
var borrowSchema = new mongoose.Schema({
    borrow_date: Date,
    person_id: new mongoose.Schema.Types.ObjectId,
    patient: String,
    user_id: new mongoose.Schema.Types.ObjectId,
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
    }
},{ collection: 'borrow'});

module.exports = mongoose.model('borrow', borrowSchema);