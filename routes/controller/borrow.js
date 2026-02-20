var mongoose = require('../connect');//เชื่อมต่อฐานข้อมูล
var borrow = require('../schema/borrow');

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

      // 2+3) join borrow_details + karupans (รวมกัน)
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