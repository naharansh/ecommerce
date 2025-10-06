const  Stripe = require("stripe")
const stripe=new Stripe(process.env.Secret_key)
exports.PaymentHook=async (req,res) => {
    try{
            const signature=req.headers['stripe-signature']
            let event=stripe.webhooks.constructEvent(
                req.body,
                signature,
                process.env.
            )
    }catch(error)
    {

    }   
}