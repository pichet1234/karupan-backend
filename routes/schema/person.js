var mongoose = require('../connect');//เชื่อมต่อฐานข้อมูล
var personSchema = new mongoose.Schema({
    fname: String,
    lname: String,
    phone: String,
    relation: String
},{ collection: 'person'});

module.exports = mongoose.model('person', personSchema);