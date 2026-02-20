var mongoose = require('../connect');//เชื่อมต่อฐานข้อมูล
var borrowDetails = require('../schema/borrow_details');
var karupans = require('../schema/karupans');
var borrow = require('../schema/borrow');
var returnKarupan = require('../schema/return_karupan');
var finance = require('../schema/financelogs');
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

          await Promise.all(
            apidata.map(item =>
              karupans.findByIdAndUpdate(
                item.karupanid,
                { status: "ถูกยืม" }
              )
            )
          );

      const totalDeposit = items.reduce((sum, item) => {
            return sum + Number(item.diposit || 0);
          }, 0);
      await finance.create({
        borrowid: items[0].borrowid,
        status: 'borrowed',
        depositReceived: totalDeposit,
        refundPaid: 0,
        deductedAmount: 0,
        note: 'รับเงินประกันตอนยืม'
      });


      // Update countn in borrow document
      const borrowUpdatePromises = apidata.map(item => 
        borrow.findByIdAndUpdate(
          item.borrowid,
          { $inc: { countn: 1 }},
          { new: true }
        )
      );

      await Promise.all(borrowUpdatePromises);

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
  },
  returnReborwDetl: async (req, res) => {
    try {
  
      const itemdata = req.body;   
  
      if (!itemdata.borrowdetailid) {
        return res.status(400).json({ message: 'reborrowId ไม่ถูกต้อง' });
      }
      const apidata = await returnKarupan.create({
        borrow_id: itemdata.borrow_id,
        return_date: itemdata.returnDate,
        receiver_id: itemdata.receiver,
        note: itemdata.returnRemark
      });
      const borrowFinance = await finance.findOne({
        borrowid: itemdata.borrow_id,
        status: 'borrowed'
      });
      const refundPaid = Number(itemdata.deposit || 0);
      const deductedAmount =Math.max(borrowFinance.depositReceived - refundPaid, 0);
      await finance.create({
        borrowid: itemdata.borrow_id,
        borrowdetailid: itemdata.borrowdetailid,
        status: 'returned',
        depositReceived: 0,
        refundPaid: refundPaid,
        deductedAmount: deductedAmount,
        note: itemdata.note || 'คืนเงิน / หักค่าบำรุง'
      });

      await borrowDetails.findByIdAndUpdate(
        itemdata.borrowdetailid,
        { statuskarupan: "คืนแล้ว" }
      );
  
      await karupans.findByIdAndUpdate(
        itemdata.karupanid,
        { status: "ใช้งานได้" }
      );

      await borrow.findByIdAndUpdate(
        apidata.borrow_id,
        { $inc: { countn: -1 } },
        );

      // ถ้า countn = 0 → คืนสำเร็จ
      const borrowDoc = await borrow.findById(apidata.borrow_id);

        if (borrowDoc.countn === 0) {
          await borrow.findByIdAndUpdate(
            apidata.borrow_id,
            {
              $set: {
                statusborrow: "คืนสำเร็จ",
                expenses: 0
              }
            },
            { new: true }
          );
        }
  
      res.status(200).json({ message: 'คืนการยืมสำเร็จ', data: apidata });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
  },
  removeReborwDetl: async (req, res) => {
    try {
      const { id } = req.params;
  
      const borwDetl = await borrowDetails.findByIdAndDelete(id);
  
      if (!borwDetl) {
        return res.status(404).json({ message: 'ไม่พบข้อมูล' });
      }
  
      res.status(200).json({
        message: 'ลบข้อมูลสำเร็จ',
        data: borwDetl
      });
  
    } catch (err) {
      res.status(500).json({ message: 'Server Error', error: err.message });
    }
  }
   
};
