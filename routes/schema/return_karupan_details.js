var mongoose = require('../connect');//เชื่อมต่อฐานข้อมูล
var Schema = mongoose.Schema;

var returnKarupanDetailsSchema = new mongoose.Schema({
    return_karupan_id: { type: Schema.Types.ObjectId, ref: 'return_karupan', required: true },
    karupanid: { type: Schema.Types.ObjectId, ref: 'karupans', required: true },
    qty:Number,
    condition: String
}, { collection: 'return_karupan_details' });
module.exports = mongoose.model('return_karupan_details', returnKarupanDetailsSchema);