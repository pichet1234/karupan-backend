var mongoose = require('../connect');
var karupans = mongoose.model('karupans',require('../schema/karupans'));

module.exports = { 
    addkarupans: async (req, res) => {
        try{
            let imageUrl = '';
            if (req.file) {
              imageUrl = `uploads/${req.file.filename}`;
            }
            const apidata = await karupans.create({
                kname: req.body.kname,
                karupantype: req.body.karupantype,
                karupanCode: req.body.karupanCode,
                redate: req.body.redate,
                detail: req.body.detail,
                price: req.body.price,
                station: req.body.station,
                expenditure: req.body.expenditure,
                usefullife: req.body.usefullife,
                status: req.body.status,
                brand: req.body.brand,
                imageUrl: imageUrl
             });
             return res.status(201).json({ message: 'karupans added successfully', data: apidata });
        } catch (error) { 
            res.status(500).json({ message: 'Server Error', error: error.message });
        }
    }
}