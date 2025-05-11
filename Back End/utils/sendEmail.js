const nodemailer = require("nodemailer");

const sendEmail = async (
  type,
  patientName,
  doctorName,
  to,
  appointmentDate = null,
  amount = null,
  paymentMethod = null
) => {
  const transporter = nodemailer.createTransport({
    host: process.env.HOST_EMAIL,
    port: process.env.PORT_EMAIL,
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.PASS_EMAIL,
    },
  });

  const emailTemplates = {
    new: {
      subject: `New Appointment Scheduled with Dr. ${doctorName}`,
      headerColor: "#4CAF50",
      statusText: "scheduled",
      actionButton: true,
      buttonText: "View Appointment Details",
      link: "http://localhost:5174/admin/appointment",
    },
    cancelled: {
      subject: `Appointment with Dr. ${doctorName} Cancelled`,
      headerColor: "#f44336",
      statusText: "cancelled",
      actionButton: true,
      buttonText: "Reschedule Appointment",
      link: "http://localhost:5173/doctors",
    },
    completed: {
      subject: `Appointment with Dr. ${doctorName} Completed`,
      headerColor: "#2196F3",
      statusText: "completed",
      actionButton: false,
      footerNote: "We hope to see you again soon!",
    },
    payment_confirmed: {
      subject: `Payment Confirmed for Appointment with Dr. ${doctorName}`,
      headerColor: "#9C27B0",
      statusText: "payment confirmed",
      actionButton: true,
      buttonText: "View Appointment",
      link: "http://localhost:5173/my-appointment",
      footerNote: "Thank you for your payment!",
      showPayment: true,
    },
    payment_cancelled: {
      subject: `Payment Cancelled for Appointment with Dr. ${doctorName}`,
      headerColor: "#FF5722",
      statusText: "payment cancelled",
      actionButton: true,
      buttonText: "Try Payment Again",
      link: "http://localhost:5173/payment",
      footerNote: "Please try again or contact support.",
      showPayment: true,
    },
  };

  const template =
    emailTemplates[type.toLowerCase()] || emailTemplates.cancelled;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden; }
        .header { background-color: ${
          template.headerColor
        }; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .footer { background-color: #f5f5f5; padding: 10px; text-align: center; font-size: 12px; color: #777; }
        .button { display: inline-block; background-color: ${
          template.headerColor
        }; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 15px; }
        .appointment-date { font-weight: bold; color: ${template.headerColor}; }
        .payment-details { margin: 15px 0; padding: 15px; background: #f9f9f9; border-radius: 5px; }
        .payment-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${template.subject}</h1>
        </div>
        <div class="content">
          <p>Dear <strong>${patientName}</strong>,</p>
          <p>Your appointment with <strong>Dr. ${doctorName}</strong> has been 
          <span style="color: ${template.headerColor};">${
    template.statusText
  }</span>.</p>
          
          ${
            appointmentDate
              ? `
            <p>Scheduled for: <span class="appointment-date">${new Date(
              appointmentDate
            ).toLocaleString()}</span></p>
          `
              : ""
          }
          
          ${
            template.showPayment
              ? `
            <div class="payment-details">
              <div class="payment-row">
                <span>Amount:</span>
                <span><strong>$${amount?.toFixed(2) || "0.00"}</strong></span>
              </div>
              ${
                paymentMethod
                  ? `
                <div class="payment-row">
                  <span>Payment Method:</span>
                  <span>${paymentMethod}</span>
                </div>
              `
                  : ""
              }
            </div>
          `
              : ""
          }
          
          ${
            template.actionButton
              ? `
            <a href="${template.link}" class="button">
              ${template.buttonText}
            </a>
          `
              : ""
          }
        </div>
        <div class="footer">
          <p>${
            template.footerNote ||
            "Please contact us if you have any questions."
          }</p>
          <p>© ${new Date().getFullYear()} Medical Clinic. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"Medical Clinic" <${process.env.USER_EMAIL}>`,
    to,
    subject: template.subject,
    html: html,
  });
};

module.exports = sendEmail;
