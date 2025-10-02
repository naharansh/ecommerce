const nodemailer = require('nodemailer')
const Sendmailer = async (options) => {
    try {
        const transport = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.USER_NAME,
                pass: process.env.PASSWORD
            }
        })
        const emailOptions = {
            from: 'naharansh489@gmail.com',
            to: options.email,
            text: options.message,

        }
        await transport.sendMail(emailOptions)

    } catch (error) {
        console.log(error)
    }

}
module.exports=Sendmailer;