var mongoose = require('../connect');//เชื่อมต่อฐานข้อมูล
var borrow = require('../schema/borrow');

module.exports = {
    addBorrow: async (req, res) => {
        try {
            const apidata = await borrow.create({
                borrow_date: req.body.borrow_date,
                person_id: req.body.personid,
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
    }
};