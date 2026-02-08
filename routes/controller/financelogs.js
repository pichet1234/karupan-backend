var finance = require('../schema/financelogs');
module.exports = {
 getAllFinanceLogs: async (req, res) => {
    try {
            const data = await finance.aggregate([
                            // 1) join borrow
                {
                    $lookup: {
                    from: 'borrow',
                    localField: 'borrowid',
                    foreignField: '_id',
                    as: 'borrow'
                    }
                },
                {
                    $unwind: {
                    path: '$borrow',
                    preserveNullAndEmptyArrays: true
                    }
                },

                // 2) join borrow_details
                {
                    $lookup: {
                    from: 'borrow_details',
                    localField: 'borrowdetailid',
                    foreignField: '_id',
                    as: 'borrow_detail'
                    }
                },
                {
                    $unwind: {
                    path: '$borrow_detail',
                    preserveNullAndEmptyArrays: true
                    }
                },

                // 3) join karupans
                {
                    $lookup: {
                    from: 'karupans',
                    localField: 'borrow_detail.karupanid',
                    foreignField: '_id',
                    as: 'karupan'
                    }
                },
                {
                    $unwind: {
                    path: '$karupan',
                    preserveNullAndEmptyArrays: true
                    }
                },

                // 4) รวม karupan เข้า borrow_detail
                {
                    $addFields: {
                    'borrow_detail.karupan': '$karupan'
                    }
                },

                // 5) ลบ field karupan ระดับบนออก
                {
                    $project: {
                    karupan: 0
                    }
                },

                // 6) sort
                {
                    $sort: { createdAt: -1 }
                }
                ]);

            res.status(200).json({ message: 'ดึงบัญชีการเงินสำเร็จ', data });
        } catch (error) {
            res.status(500).json({ message: 'Server Error', error: error.message });
        }
    }
}