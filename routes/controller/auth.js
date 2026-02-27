const User = require('../schema/users');
const jwt = require('jsonwebtoken');

function generateAccessToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role },
    'ACCESS_SECRET',
    { expiresIn: '15m' }
  );
}

function generateRefreshToken(user) {
  return jwt.sign(
    { id: user._id },
    'REFRESH_SECRET',
    { expiresIn: '7d' }
  );
}

module.exports = {
    register: async(req, res)=>{
        try {
            const { username, password, fullname, role } = req.body;
        
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
        
            res.json({ message: 'User created' });
          } catch (err) {
            res.status(500).json(err);
          }
    },
    login: async(req, res)=>{
        try {
            const user = await User.findOne({ username: req.body.username });
            if (!user) return res.status(400).json({ message: 'Invalid' });
          
            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);
          
            user.refreshToken = refreshToken;
            await user.save();
          
            res.json({ accessToken, refreshToken });
          } catch (err) {
            res.status(500).json(err);
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