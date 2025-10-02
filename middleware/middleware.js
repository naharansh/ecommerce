const User=require('../schema/users')
const utils=require('util')
const jsonWebToken=require('jsonwebtoken')
exports.Protected = async (req, res, next) => {
    try {
        // 1. Get token from cookie
        const token = req.cookies?.token;
        
        if (!token) {
            return res.status(401).json({
                status: 'error',
                message: 'Token is missing'
            });
        }

        // 2. Verify token
        const decoded = await utils.promisify(jsonWebToken.verify)(token, process.env.JWT_SECRET);
     
        // 3. Find user by decoded key
        const user = await User.findByPk(decoded.key);
       
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        // 4. Attach user to request object
        req.users = user.toJSON();
      

        next();
    } catch (error) {
        console.error(error);
        res.status(403).json({ status: 'error', message: 'Invalid token' });
    }
}