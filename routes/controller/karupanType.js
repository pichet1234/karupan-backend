var mongoose = require('../connect');//เชื่อมต่อฐานข้อมูล
var karupanType = mongoose.model('karupanType',require('../schema/karupanType'));
module.exports = {
    addkarupanType: async (req, res) => {
        try {
            const apidata = await karupanType.insertOne({
                karupanType: req.body.karupanType,
                details: req.body.details
            });
            res.status(201).json({ message: 'karupanType added successfully', data: apidata });
        }
        catch (error) { 
            res.status(500).json({ message: 'Server Error', error: error.message });
        }
    }
}