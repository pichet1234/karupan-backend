const user = require('../schema/users');
module.exports = {
    getAllUsers: async (req, res) => {
        try {
            const users = await user.find({
            role: { $in: ['admin', 'staff', 'viewer'] }
            })
            .select('fullname email position tel role createdAt')
            .sort({ createdAt: -1 })
            .lean();

            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({
            message: 'Error fetching users',
            error: error.message
            });
        }
    },
    getUserById: async(req, res)=>{
        try {
            const { id } = req.params;
            const userData = await user.findById(id);
            if (!userData) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(userData);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    updateUser: async(req, res)=>{
        try {
            const { id } = req.params;
            const { username, fullname, email, position, tel, role } = req.body;
            const updatedUser = await user.findByIdAndUpdate(
                id,
                { username, fullname, email, position, tel, role },
                { new: true }
            );
            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json({ message: 'User updated', user: updatedUser });
        } catch (err) {
            res.status(500).json(err);
        }   
    },
    deleteUser: async(req, res)=>{
        try {
            const { id } = req.params;
            const deletedUser = await user.findByIdAndDelete(id);
            if (!deletedUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json({ message: 'User deleted' });
        } catch (err) {
            res.status(500).json(err);
        }   
    }
}