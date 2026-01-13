var mongoose = require('../connect');//เชื่อมต่อฐานข้อมูล
var borrowDetails = require('../schema/borrow_details');

module.exports = {
    addBorrowDetails: async (req, res) => {
        try {
            const { items } = req.body;

            if (!Array.isArray(items) || items.length === 0) {
                return res.status(400).json({
                    message: 'ข้อมูล items ไม่ถูกต้อง'
                });
            }

            const apidata = await borrowDetails.insertMany(items);

            res.status(201).json({
                message: 'บันทึกรายละเอียดการยืมสำเร็จ',
                count: apidata.length,
                data: apidata
            });
        } catch (error) {
            res.status(500).json({
                message: 'Server Error',
                error: error.message
            });
        }
    }
};