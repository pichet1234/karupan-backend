var mongoose = require('../connect');//เชื่อมต่อฐานข้อมูล
var borrow = require('../schema/borrow');
var borrow_details = require('../schema/borrow_details');
var financelogs = require('../schema/financelogs');
var karupans = require('../schema/karupans');

module.exports = {
    addBorrow: async (req, res) => {
        try {
            const apidata = await borrow.create({
                borrow_date: req.body.borrow_date,
                person_id: req.body.personid,
                patient: req.body.patient,
                user_id: req.body.userid,
                address: {
                    bannumber: req.body.bannumber,
                    moo: req.body.moo,
                    village: req.body.village,
                    tambon: req.body.tambon
                },
                expenses: 0,
                details: req.body.details,
                remark: req.body.remark,
                statusborrow:'ยังไม่คืน',
                return_date: null,
                countn: 0
            });
            res.status(201).json({ message: 'บันทึกการยืมสำเร็จ', data: apidata });
        } catch (error) {
            res.status(500).json({ message: 'Server Error', error: error.message });
        }
    },
    editborrow: async (req, res) => {
        try {
           const {_id,village,patient,tambon,moo,bannumber,borrow_date,remark } = req.body;
           if (!req.body._id){
            return res.status(400).json({ message: 'ไม่พบข้อมูลการยืม' });
           }
           const dataUpdate = {
            patient,
            address: {
              village,
              tambon,
              moo,
              bannumber,
            },
            borrow_date: borrow_date ? new Date(borrow_date) : null,
            remark
           };
            await borrow.findByIdAndUpdate(  
                _id,
              { $set: dataUpdate },
              { new: true }
            );
           res.status(200).json({ message: 'อัปเดตข้อมูลการยืมสำเร็จ' });
        } catch (error) {
            res.status(500).json({ message: 'Server Error', error: error.message });
        }
    },
    removeBorrow: async (req, res) => {
        const session = await mongoose.startSession();
              session.startTransaction();
        try {
              const  borrowid  = req.body._id;

              if (!borrowid) {
                return res.status(400).json({ message: "ไม่พบ borrow id" });
              }
               // 1️⃣ ดึงรายการครุภัณฑ์ที่ยืม
             const details = await borrow_details.find({ borrowid }).session(session);
              // 2️⃣ update ครุภัณฑ์กลับเป็นใช้งานได้
              for (const item of details) {
                await karupans.findByIdAndUpdate(
                  item.karupanid,
                  { $set: { statuskarupan: "ใช้งานได้" } },
                  { session }
                );
              }
            // 3️⃣ ลบ financelog
              await financelogs.deleteMany({ borrowid }).session(session);

              // 4️⃣ ลบ borrow details
              await borrow_details.deleteMany({ borrowid }).session(session);

              // 5️⃣ ลบ borrow
              await borrow.findByIdAndDelete(borrowid).session(session);

              await session.commitTransaction();
              session.endSession();

              res.status(200).json({
                message: "ลบการยืมครุภัณฑ์สำเร็จ"
              });
        } catch (error) {
          await session.abortTransaction();
          session.endSession();
          res.status(500).json({ message: "เกิดข้อผิดพลาด", error: error.message });
        }
    },
    getAllBorrows: async (req, res) => {
  try {
    const apidata = await borrow.aggregate([

      // 1) join person (แยกเหมือนเดิม)
      {
        $lookup: {
          from: 'person',
          localField: 'person_id',
          foreignField: '_id',
          as: 'person'
        }
      },
      {
        $unwind: {
          path: '$person',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
                from: 'financelogs',
                localField: '_id',
                foreignField: 'borrowid',
                as: 'financelog'
              }
      },
      {
        $lookup: {
          from: 'borrow_details',
          let: { borrowId: '$_id' },
          pipeline: [
            // match borrow_details.borrowid = borrow._id
            {
              $match: {
                $expr: { $eq: ['$borrowid', '$$borrowId'] }
              }
            },

            // join karupans จาก borrow_details.karupanid
            {
              $lookup: {
                from: 'karupans',
                localField: 'karupanid',
                foreignField: '_id',
                as: 'karupan'
              }
            },
            {
              $unwind: {
                path: '$karupan',
                preserveNullAndEmptyArrays: true
              }
            }
          ],
          as: 'details'
        }
      }

    ]);

        res.status(200).json({ message: 'ดึงข้อมูลการยืมสำเร็จ', data: apidata });
     } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
  },
  countStatusone: async (req, res) => {
    try {
      const count = await borrow.countDocuments({ statusborrow: 'ยังไม่คืน' });
      res.status(200).json({ message: 'นับจำนวนการยืมที่ยังไม่คืนสำเร็จ', count: count });
    } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
  },
  countStatustwo: async (req, res) => {
    try {
      const count = await borrow.countDocuments({ statusborrow: 'คืนสำเร็จ' });
      res.status(200).json({ message: 'นับจำนวนการยืมที่คืนสำเร็จ', count: count });
    } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
  },
  countborrowAll: async (req, res) => {
    try {
      const count = await borrow.countDocuments();
      res.status(200).json({ message: 'นับจำนวนการยืมทั้งหมดสำเร็จ', count: count });
    } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
  }
};