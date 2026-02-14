var mongoose = require('../connect');
var karupans = require('../schema/karupans');
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
    },
    countkarupanall: async (req, res) => {
        try {
            const count = await karupans.countDocuments();
            res.status(200).json({ message: 'Success', count });
        } catch (error) {
            res.status(500).json({ message: 'Server Error', error: error.message });
        }
    },
    countkpssucess: async (req, res) => { // นับจำนวนครุภัณฑ์ที่มีสถานะ "ใช้งานได้"
        try {
            const result = await karupans.aggregate([
                {
                    $match: { status: 'ใช้งานได้' }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 }
                    }
                }
            ]);
            res.status(200).json({ message: 'Success', result });
        } catch (error) {
            res.status(500).json({ message: 'Server Error', error: error.message });
        }           
    },
    countkpsdanger: async (req, res) => { // นับจำนวนครุภัณฑ์ที่มีสถานะ "ชำรุด"
        try {
            const result = await karupans.aggregate([   
                {
                    $match: { status: 'ชำรุด' }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 }
                     }
                }
            ]);
            res.status(200).json({ message: 'Success', result });
        }
        catch (error) {
            res.status(500).json({ message: 'Server Error', error: error.message });
        }
    },
    deletekarupan: async (req, res) => {
        try {
            const { id } = req.params;
            const deletedKarupan = await karupans.findByIdAndDelete(id);
            if (!deletedKarupan) {
                return res.status(404).json({ message: 'karupan not found' });
            }
            res.status(200).json({ message: 'karupan deleted successfully', data: deletedKarupan });
        } catch (error) {
            res.status(500).json({ message: 'Server Error', error: error.message });
        }
    },
    updateKarupan: async (req, res) => {
        try {
    const { _id,brand,detail, expenditure,karupanCode,kname,price,redate,station,status,usefullife } = req.body;
        // ✅ เช็ค id
    if (!req.body._id) {
      return res.status(400).json({
        message: 'Missing karupan ID'
      });
    }
    // ✅ เช็คไฟล์ภาพใหม่
    let imageUrl = req.body.imageUrl || '';
    if (req.file) {
      imageUrl = `uploads/${req.file.filename}`;
    }

    // ✅ object สำหรับ update
    const updateData = {
      brand,
      detail,
      expenditure,
      imageUrl,
      karupanCode,
      kname,
      price: Number(price),
      redate: new Date(redate),
      station,
      status,
      usefullife: Number(usefullife)
    };
    // ✅ update database
    const updatedKarupan = await karupans.findByIdAndUpdate(
      _id,
      updateData,
      { new: true }
    );

    if (!updatedKarupan) {
      return res.status(404).json({ message: 'Karupan not found' });
    }
    res.status(200).json({ message: 'Update success', data: updatedKarupan });
    } catch (error) {
            res.status(500).json({ message: 'Server Error', error: error.message });
        }
    }
}