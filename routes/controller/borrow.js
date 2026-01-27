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
                return_date: null
            });
            res.status(201).json({ message: 'บันทึกการยืมสำเร็จ', data: apidata });
        } catch (error) {
            res.status(500).json({ message: 'Server Error', error: error.message });
        }
    },
    getAllBorrows: async (req, res) => {
        try {
            const apidata = await borrow.aggregate([
                            // 1) join person
                            {
                                $lookup: {
                                from: 'person',
                                localField: 'person_id',
                                foreignField: '_id',
                                as: 'person'
                                }
                            },
                            {
                                $unwind: '$person'   // แปลง array → object
                            },

                            // 2) join borrow_details
                            {
                                $lookup: {
                                from: 'borrow_details',
                                localField: '_id',        // borrow._id
                                foreignField: 'borrowid', // borrow_details.borrowid
                                as: 'details'
                                }
                            },
                            {
                                $unwind: '$details'   // แปลง array → object
                            },
                            // 3) join karupans (จาก details.karupanid)
                            {
                                $lookup: {
                                from: 'karupans',
                                localField: 'details.karupanid', // FK
                                foreignField: '_id', // PK
                                as: 'karupan'
                                }
                                },
                                { $unwind: '$karupan' }
                        ])
            res.status(200).json({ message: 'ดึงข้อมูลการยืมสำเร็จ', data: apidata });
        } catch (error) {
            res.status(500).json({ message: 'Server Error', error: error.message });
        }
    }
};