var mongoose = require('../connect');//เชื่อมต่อฐานข้อมูล
var borrowDetails = require('../schema/borrow_details');
var karupans = require('../schema/karupans');

module.exports = {
  addBorrowDetails: async (req, res) => {
    try {
      const { items } = req.body;

      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
          message: 'ข้อมูล items ไม่ถูกต้อง'
        });
      }

      // แปลงข้อมูลให้ตรง schema
      const docs = items.map(item => ({
        borrowid: item.borrowid,
        karupanid: item.karupanid,
        kname: item.kname,
        karupuncode: item.karupuncode,
        statuskarupan: item.statuskarupan,
        diposit: item.diposit
      }));

      const apidata = await borrowDetails.insertMany(docs);
      console.log(apidata)
      const updatePromises = items.map(data =>
        karupans.findByIdAndUpdate(
        {_id:data.karupanid},
        { status: "ถูกยืม" },
        { new: true }
        )
        );
        
        
        await Promise.all(updatePromises);

      res.status(201).json({
        message: 'บันทึกรายละเอียดการยืมสำเร็จ',
        count: apidata.length,
        data: apidata
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Server Error',
        error: error.message
      });
    }
  }
};
