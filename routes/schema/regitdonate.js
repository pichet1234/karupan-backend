var mongoose = require('../connect');
var regitdonateSchema = new mongoose.Schema({
    karupanid: mongoose.Schema.Types.ObjectId,
    donate_date: Date,
    name: String,
    address: String,
    tel: String,
}, { collection: 'regitdonate' });

module.exports = regitdonateSchema;