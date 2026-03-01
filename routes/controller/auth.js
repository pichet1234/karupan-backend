const User = require('../schema/users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');



function generateAccessToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,   // ✅ ใช้ env ตัวเดียวกับ verify
    { expiresIn: '15m' }
  );
}

function generateRefreshToken(user) {
  return jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET,  // ✅ ใช้ env เช่นกัน
    { expiresIn: '7d' }
  );
}

module.exports = {
    register: async(req, res)=>{
        try {
            const { username, password, fullname, email, position, tel, role } = req.body;
        
            const exist = await User.findOne({ username });
            if (exist) return res.status(400).json({ message: 'Username already exists' });
        
            const hash = await bcrypt.hash(password, 10);
        
            const user = await User.create({
              username,
              password: hash,
              fullname,
              email,
              position,
              tel,
              role
            });
        
            res.json({ message: 'User created' ,data:user});
          } catch (err) {
            res.status(500).json(err);
          }
    },
    login: async (req, res) => {
      try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });

        if (!user) {
          return res.status(400).json({ message: 'Invalid username or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          return res.status(400).json({ message: 'Invalid username or password' });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        user.refreshToken = refreshToken;
        await user.save();

        res.status(200).json({
          accessToken,
          refreshToken,
          user: {
            fullname: user.fullname,
            email: user.email,
            position: user.position,
            tel: user.tel,
            role: user.role
          }
        });

      } catch (err) {
        res.status(500).json({
          message: 'Server error',
          error: err.message
        });
      }
    },
    refresh: async(req, res)=>{
        const { refreshToken } = req.body;
        if (!refreshToken) return res.sendStatus(401);
      
        const user = await User.findOne({ refreshToken });
        if (!user) return res.sendStatus(403);
      
        jwt.verify(refreshToken, 'REFRESH_SECRET', (err) => {
          if (err) return res.sendStatus(403);
      
          const newAccessToken = generateAccessToken(user);
          res.json({ accessToken: newAccessToken });
        });
    },
    logout: async(req, res)=>{
        const user = await User.findById(req.user.id);
        user.refreshToken = null;
        await user.save();
        res.json({ message: 'Logged out' });
    }
}