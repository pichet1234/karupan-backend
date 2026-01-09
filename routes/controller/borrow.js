var mongoose = require('../connect');//เชื่อมต่อฐานข้อมูล
var borrow = require('../schema/borrow');

module.exports = {
    addBorrow: async (req, res) => {
        try {
            const apidata = await borrow.create({
                borrow_date: req.body.borrow_date,
                return_date: req.body.return_date,
                karupanid: req.body.karupanid,
                personid: req.body.personid,
                user_id: req.body.user_id,
                address: {
                    bannumber: req.body.address.bannumber,
                    moo: req.body.address.moo,
                    village: req.body.address.village,
                    tambon: req.body.address.tambon
                },
                expenses: 0,
                details: req.body.details,
                remark: req.body.remark,
                return_date: null
            });
            res.status(201).json({ message: 'Borrow record added successfully', data: apidata });
        } catch (error) {
            res.status(500).json({ message: 'Server Error', error: error.message });
        }
    }
};