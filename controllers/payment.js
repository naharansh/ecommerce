const Stripe = require('stripe');
const stripe = new Stripe(process.env.SECRET_KEY);

exports.Create = async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 5000,              // $50.00
      currency: 'usd',
      payment_method: 'pm_card_visa', // Stripe test PM
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never'   // Option 1: no redirect
      }
    });

    console.log('PaymentIntent ID:', paymentIntent.id);

    res.status(200).json({
      status: 'success',
      paymentIntent
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: error.message });
  }
};
