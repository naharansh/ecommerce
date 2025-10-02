const Notification = require('../schema/notification.js')
const Sendmailer = require('../config/mail.js')
exports.Sends = async (req, res) => {
    try {
        const userid = req.users.user_id
        console.log(userid)
        const { title, message, type } = req.body
        if (req.users.role !== 'admin') {
                return res.status(201).json({
                    status:'error',
                    message:'Forbidden'
                })
        }

        const notify = await Notification.create({
            title,
            message,
            type,
            status: 'pending',
            user_id: userid

        })
        switch (type) {
            case 'email':
                if (req.users.email) {
                    Sendmailer({
                        email: req.users.email,
                        message
                    })
                    notify.update({ status: 'sent' })
                }
                Sendmailer()
                break;
            case 'sms':

                await notify.update({ status: 'sent' });
                break;

            case 'push':
            case 'inapp':

                await notify.update({ status: 'sent' });
                break;

            default:
                await notify.update({ status: 'failed' });
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid notification type',
                });
                break;
        }
        res.status(200).json({
            status: 'success',
            message: 'Notification sent successfully',
            data: notify,
        });
    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: error.message
        })
    }
}
exports.ALLdata=async (req,res) => {
try {
    const result=await Notification.findAll()
    res.status(200).json({
        status:'success',
        result
    })
} catch (error) {
    console,log(error)
}
    
}