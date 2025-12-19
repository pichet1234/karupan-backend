var mongoose = require('../connect');//เชื่อมต่อฐานข้อมูล
var karupansSchema = new mongoose.Schema({
    kname: String,
    karupantype: mongoose.Schema.Types.ObjectId,
    karupanCode:String,
    redate: Date,
    detail: String,
    price: Number,
    station: String,
    expenditure: String,
    usefullife: String,
    status:String,
    brand: String,
    imageUrl: String,
},{ collection: 'karupans' });

module.exports = karupansSchema;