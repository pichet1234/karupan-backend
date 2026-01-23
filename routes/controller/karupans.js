var mongoose = require('../connect');
var karupans = mongoose.model('karupans',require('../schema/karupans'));
var regitdonate = mongoose.model('regitdonate',require('../schema/regitdonate'));

module.exports = { 
    //=============================== แบบทั่วไป =================================//
    addkarupans: async (req, res) => { 
        try{
            let imageUrl = '';
            if (req.file) {
              imageUrl = `uploads/${req.file.filename}`;
            }
            const apidata = await karupans.create({
                kname: req.body.kname,
                karupantypeid: req.body.karupantype,
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
    },
    //=============================== สำหรับบริจาค =================================//
    donatekarupan: async (req, res) => { 
        try {
            //===== ส่วนนี้ลง collection karupans =====
            let imageUrl = '';
            if (req.file) {
              imageUrl = `uploads/${req.file.filename}`;
            }
                const apidata = await karupans.create({
                kname: req.body.kname,
                karupantypeid: req.body.karupantype,
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

            //====== ส่วนนี้ลง collection regitdonate ======
             if (apidata && apidata._id) {
                 await regitdonate.create({ 
                     karupanid: apidata._id,
                     donate_date: new Date(),
                     name: req.body.uname,
                     address: req.body.address,
                     tel: req.body.tel
                    });
                return res.status(201).json({ message: 'karupans added successfully', data: apidata });
             }
        } catch (error) { 
            res.status(500).json({ message: 'Server Error', error: error.message });
        }
    },
    getKarupan: async (req, res ) => {
        try {
            const items = ["เตียงผู้ป่วย","ถังออกซิเจนใหญ่","ที่นอนลม" ,"เครื่องผลิตออกซิเจน","เครื่องผลิตออกซิเจนด้วยระบบไฟฟ้า","ที่นอนลม","วีลแชร์"];
            const data = await karupans.find({
            kname: { $in: items },
            status: 'ใช้งานได้'
            });
            res.status(200).json({ message: 'Success', data }); 
        } catch (error) {
            res.status(500).json({ message: 'Server Error', error: error.message });
        }
    },
    getkarupanall: async (req , res) =>{
        try {
            const data = await karupans.aggregate([
                {
                    $lookup: {
                        from: 'karupanType',
                        localField: 'karupantypeid',
                        foreignField: '_id',
                        as: 'karupanTypeInfo'
                    }
                }
            ]);
            res.status(200).json({ message: 'Success', data }); 
        } catch (error){
            res.status(500).json({ message: 'Server Error', error: error.message });
        }
    }
}