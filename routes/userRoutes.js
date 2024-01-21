const express = require('express');
const router = express.Router();
const UserModel = require('../models/reservation');
const stripe = require('stripe')('sk_test_51OaEFsSCqY0t9Wjt1P3vaC4XjeyeALWVebeIHEdg6J8Woc1qR7MUzPz6lvd1v5BQOKjqn4ORwHhlKUbK90NLBtKA007qmGUyhv');

router.post('/reservation', async (req, res) => {
    try {
      const userData = req.body; // Assuming the object data is sent in the request body
      const newUser = new UserModel(userData);
      const savedUser = await newUser.save();
      res.status(200).json(savedUser);
    } catch (error) {
      console.error('Error adding items:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

router.get('/dayreservations/:date',async (req,res)=>{
  try {
    const date = req.params.date
    const foundReservations = await UserModel.find({ date: new RegExp(date, 'i') });
    res.status(200).json(foundReservations);
  }
  catch(err){
    console.error('Error finding items:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

router.get('/check-payment-status', async (req, res) => {
  const { sessionId } = req.query;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const paymentStatus = session.payment_status;

    res.json({ paymentStatus });
  } catch (error) {
    console.error('Error retrieving payment status:', error);
    res.status(500).json({ error: 'Error retrieving payment status' });
  }
})

// router.post('/webhook', async (req, res) => {
//   const payload = req.rawBody

//   try {
//     console.log(payload)
//     const event = stripe.webhooks.constructEvent(payload, req.headers['stripe-signature'], 'whsec_m400H3DdwfXEHpUiBE5eaUrnknNgaiXk');
//     if (event.type === 'checkout.session.completed') {
//       const session = event.data.object;
//       // Do something with the completed Checkout session
//       console.log('Checkout Session Completed:', session);
//     }

//     res.status(200).end();
//   } catch (error) {
//     console.error('Error handling Stripe webhook event:', error.message);
//     res.status(400).send(`Webhook Error: ${error.message}`);
//   }
// });

router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const payload = req.body

  try {
    // console.log(payload)
    const signature = req.headers['stripe-signature']
    const event = stripe.webhooks.constructEvent(payload, signature, 'whsec_m400H3DdwfXEHpUiBE5eaUrnknNgaiXk');
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      // Do something with the completed Checkout session
      console.log('Checkout Session Completed:', session);
    }

    res.status(200).end();
  } catch (error) {
    console.error('Error handling Stripe webhook event:', error.message);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

router.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    billing_address_collection: 'required',
    line_items: [
      {
        price: req.body.priceId,
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: 'http://3.7.66.184/', 
    cancel_url: 'http://3.7.66.184/',
  });

  res.json({ id: session.id });
});
  

module.exports = router;
