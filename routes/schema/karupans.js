var mongoose = require('../connect');//เชื่อมต่อฐานข้อมูล
var Schema = mongoose.Schema;
var karupansSchema = new mongoose.Schema({
    kname: String,
    karupantypeid: { type: Schema.Types.ObjectId, ref: 'karupanType' ,required: true},
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

module.exports = mongoose.model('karupans', karupansSchema);