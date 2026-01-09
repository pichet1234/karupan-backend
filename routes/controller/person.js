var mongoose = require('../connect');//เชื่อมต่อฐานข้อมูล
var person = require('../schema/person');
module.exports = {
    addPerson: async (req, res) => {
        try {
            const apidata = await person.create({
                fname: req.body.fname,
                lname: req.body.lname,
                phone: req.body.phone,
                relation: req.body.relation
            });
            res.status(201).json({ message: 'Person added successfully', data: apidata });
        } catch (error) {   
            res.status(500).json({ message: 'Server Error', error: error.message });
        }
    }   
};