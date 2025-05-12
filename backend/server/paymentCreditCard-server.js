const { asyncErrorHandler } = require("express-error-catcher");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KRY);
const Appointment = require("../models/appointmentModels");
const User = require("../models/userModels");
const { sendNotification } = require("./notification-server");
const sendEmail = require("../utils/sendEmail");

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
    client_reference_id: req.body.appointmentId,
  });

  res.status(200).json({ status: "success", session });
});

const paidAppointment = async (session) => {
  const appointment = await Appointment.findByIdAndUpdate(
    session.client_reference_id,
    { is_paid: true },
    { new: true }
  );

  const admin = await User.findOne({ role: admin });
  const io = req.app.get("io");
  const connectedUsers = req.app.get("connectedUsers");

  await sendNotification(
    io,
    connectedUsers,
    admin._id,
    "patient_payment",
    `Payment confirmed for patient ${appointment.user.name} with amount ${
      session.amount_total
    } for appointment with Dr. ${
      appointment.doctor.name
    } on ${new Date().toLocaleDateString()}`
  );

  await sendEmail(
    "payment_confirmed",
    appointment.user.name,
    appointment.doctor.name,
    admin.email,
    new Date().toLocaleDateString(),
    appointment.doctor.appointmentFee
  );
};

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

  if (event.type === "checkout.session.completed") {
    console.log("Yes Complete");

    const session = event.data.object;

    await paidAppointment(session);
    res.status(200).json({ status: "success" });
  } else {
    console.log("Back");
  }
});

module.exports = {
  checkOutSession,
  webhookCheckout,
};
