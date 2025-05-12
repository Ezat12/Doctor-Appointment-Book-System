const { asyncErrorHandler } = require("express-error-catcher");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KRY);

const checkOutSession = asyncErrorHandler(async (req, res, next) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: req.body.amount * 100,
          product_data: {
            name: `Payment Required for Your Appointment ${req.body.doctor}`,
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: "http://localhost:5173/my-appointment",
    cancel_url: "http://localhost:5173/my-appointment",
    customer_email: req.user.email,
  });

  res.status(200).json({ status: "success", session });
});

const webhookCheckout = asyncErrorHandler(async (req, res, next) => {
  const body = req.body;
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (e) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log("webhookCheckOut Session");
  console.log(event.type);

  if (event.type === "checkout.session.completed") {
    console.log("Yes Complete");

    res.status(200).json({ status: "success" });
  } else {
    console.log("Back");
  }
});

module.exports = {
  checkOutSession,
  webhookCheckout,
};
