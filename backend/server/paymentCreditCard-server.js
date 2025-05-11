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

module.exports = {
  checkOutSession,
};
