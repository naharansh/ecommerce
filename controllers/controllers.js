const User = require('../schema/users')
const crypto = require('crypto')
const bycrpt = require('bcrypt')
// const { stat } = require('fs')
const jsonWebToken = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const utils = require('util')
const signToken = (key, role) => {
    return jsonWebToken.sign({ key: key, role: role }, process.env.JWT_SECRET, { expiresIn: '1h' })
}
exports.registerUser = async (req, res) => {
    try {
        console.log(req.body)
        if (!req.body) {
            return res.status(559).json({
                status: 'error',
                message: 'some error has been occured'
            })
        }
        const { name, email, password, phone, role } = req.body
        const GENERATEDSALT = await bycrpt.genSalt(12)

        const hashed = await bycrpt.hash(password, GENERATEDSALT)

        const user = await User.create({
            name,
            email,
            password: hashed, // store hashed password
            phone,
            role
        });
        const token = signToken(password, role)
        console.log(token)
        res.status(201).json({
            status: 'success',
            user,
            token
        })

    }
    catch (err) {
        return res.status(559).json({
            status: 'error',
            message: err.message
        })
    }

}
exports.Login = async (req, res, next) => {
    try {
        console.log(req.body)
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(500).json({
                status: 'error',
                message: 'fields should be filled properly'
            })
        }
        let result = await User.findOne({
            where: { email }
        })
        result = result.toJSON()
        console.log(result.password)
        const checked = await bycrpt.compare(password, result.password)
        console.log(checked)
        if (!checked) {
            return res.status(500).json({
                status: 'error',
                message: 'password does not matched'
            })
        }
        const token = signToken(result.user_id, result.role)
        res.cookie('token', token, { httpOnly: true, secure: true });
        res.json({
            status: 'success',

            result
        })
    } catch (error) {
        res.status(559).json({
            status: 'error',
            message: error.message
        })
    }
}
exports.Protected = async (req, res, next) => {
    try {
        // 1. Get token from cookie
        const token = req.cookies?.token;
        console.log(token)
        if (!token) {
            return res.status(401).json({
                status: 'error',
                message: 'Token is missing'
            });
        }

        // 2. Verify token
        const decoded = await utils.promisify(jsonWebToken.verify)(token, process.env.JWT_SECRET);
        console.log(decoded)
        // 3. Find user by decoded key
        const user = await User.findByPk(decoded.key);
        console.log(user)
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        // 4. Attach user to request object
        req.users = user.toJSON();
        console.log(req.users)

        next();
    } catch (error) {
        console.error(error);
        res.status(403).json({ status: 'error', message: 'Invalid token' });
    }
}
exports.GetDetails = async (req, res) => {
    console.log(req.users)
    try {
        let result = await User.findOne({
            where: { user_id: req.users.user_id }
        })
        console.log(result)
        res.status(200).json({
            status: 'success',
            result
        })
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        })
    }
}
exports.UpdateDetails = async (req, res) => {
    try {
        console.log(req.body)
        const results = await User.update(req.body, { where: { user_id: req.users.user_id } })
        //  console.log(results)
        res.status(200).json({
            status: 'success',
            results,
            message: 'user is updated successfully'
        })
    } catch (error) {
        console.log(error)
    }

}
exports.RrefreshToken = async (req, res) => {
    try {
        const token = req.cookies?.token;
        console.log(token)
        const verfiytoken = jsonWebToken.verify(token, process.env.JWT_SECRET)
        console.log(verfiytoken)
        const newToken = signToken(verfiytoken.key, verfiytoken.role)
        console.log(newToken)
        res.cookie('token', newToken, { httpOnly: true, secure: true });
        res.status(200).json({
            status: 'success',
            newToken
        })
    } catch (err) {
        res.status(500).json({
            status: 'err',
            err: err.message
        })
    }

}
exports.LogOut = async (req, res) => {
    // Clear the cookie named 'token'
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        sameSite: 'strict'
    });

    res.status(200).json({
        status: 'success',
        message: 'Logged out successfully'
    });
}
exports.ForgetPassword = async (req, res) => {
    try {
        console.log("Dfs")
        const { email } = req.body
        if (!email) {
            return res.status(500).json({
                status: 'error',
                message: 'email is empty'
            })
        }
        const result = await User.findOne({ where: { email } })
        if (!result) {
            return res.status(500).json({
                status: 'error',
                message: 'user is not found'
            })
        }
        const resetToken = crypto.randomBytes(32).toString('hex')
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex')
        result.resetPasswordToken = hashedToken;
        result.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await result.save();
        const resetUrl = `https://yourfrontend.com/reset-password?token=${resetToken}&email=${email}`;
        const transporter = nodemailer.createTransport({
            host: 'smtp.mailtrap.io',
            port: 587,
            auth: { user: process.env.EMAIL_USERNAME, pass: process.env.EMAIL_PASSWORD }
        });

        await transporter.sendMail({
            from: '"E-Commerce" <no-reply@example.com>',
            to: email,
            subject: 'Reset Your Password',
            text: `Reset your password: ${resetUrl}`
        });

        res.json({ status: 'success', message: 'Password reset email sent' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Something went wrong' });
    }
}
exports.ResetPassword = async (req, res) => {
    try {

        const { email, token, newPassword } = req.body;
        if (!email || !token || !newPassword) {
            return res.status(400).json({ status: 'error', message: 'All fields are required' });
        }

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            where: {
                email,
                resetPasswordToken: hashedToken,
                resetPasswordExpires: { [Op.gt]: Date.now() } // token not expired
            }
        });

        if (!user) return res.status(400).json({ status: 'error', message: 'Invalid or expired token' });

        // Update password
        user.password = await bcrypt.hash(newPassword, 12);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        res.json({ status: 'success', message: 'Password reset successfully' });
    
    }
    catch(error)
    {
        res.status(500).json({

            status:'error',
            message:'some error has been occured'
        })
    }
}
