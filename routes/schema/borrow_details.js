var mongoose = require('../connect');
var borrowdetailsSchema = new mongoose.Schema({
    borrow_id: mongoose.Schema.Types.ObjectId,
    karupan_id: mongoose.Schema.Types.ObjectId,
    statusBorw: String,
    diposit: Number,
},{ collection: 'borrow_details'});

module.exports = mongoose.model('borrow_details', borrowdetailsSchema);