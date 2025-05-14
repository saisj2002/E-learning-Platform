import { createTransport } from "nodemailer";

const sendMail = async (email, subject, data) => {
  const transport = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.Gmail,
      pass: process.env.Password,
    },
  });

  const html = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>OTP Verification - Zeal Education</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #e6f2ff; /* Sky blue background */
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
      }
      .container {
        background-color: #ffffff;
        padding: 40px 25px;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 500px;
        text-align: center;
      }
      .logo {
        width: 120px;
        margin-bottom: 20px;
      }
      h1 {
        color: #0077cc; /* College blue */
        font-size: 24px;
        margin-bottom: 10px;
      }
      p {
        color: #333;
        font-size: 16px;
        margin: 10px 0;
      }
      .otp {
        font-size: 38px;
        font-weight: bold;
        color: #0056b3;
        margin: 25px 0;
        letter-spacing: 2px;
      }
      .footer {
        font-size: 12px;
        color: #777;
        margin-top: 30px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <img src="https://sp-ao.shortpixel.ai/client/q_glossy,ret_img/https://zealeducation.com/wp-content/uploads/2017/02/ZEAL-LOGO.png" alt="College Logo" class="logo" />
      <h1>OTP Verification</h1>
      <p>Dear ${data.name},</p>
      <p>Your One Time Password (OTP) for verifying your account on the college portal is:</p>
      <div class="otp">${data.otp}</div>
      <p>Please use this OTP to complete your verification process. This code is valid for a limited time and should not be shared with anyone.</p>
      <div class="footer">
        This is an automated message from Zeal Elearning Platform. If you did not request this OTP, please ignore this email.
      </div>
    </div>
  </body>
  </html>`;
  

  await transport.sendMail({
    from: process.env.Gmail,
    to: email,
    subject,
    html,
  });
};

export default sendMail;

export const sendForgotMail = async (subject, data) => {
  const transport = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.Gmail,
      pass: process.env.Password,
    },
  });

  const html = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Reset Your Password - Zeal Education</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #e6f2ff;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
      }
      .container {
        background-color: #ffffff;
        padding: 40px 25px;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 500px;
        text-align: center;
      }
      .logo {
        width: 120px;
        margin-bottom: 20px;
      }
      h1 {
        color: #0077cc;
        font-size: 24px;
        margin-bottom: 10px;
      }
      p {
        color: #333;
        font-size: 16px;
        margin: 10px 0;
      }
      .button {
        display: inline-block;
        padding: 12px 25px;
        margin: 25px 0;
        background-color: #0077cc;
        color: #ffffff;
        text-decoration: none;
        border-radius: 5px;
        font-weight: bold;
        font-size: 16px;
      }
      .footer {
        font-size: 12px;
        color: #777;
        margin-top: 30px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <img src="https://sp-ao.shortpixel.ai/client/q_glossy,ret_img/https://zealeducation.com/wp-content/uploads/2017/02/ZEAL-LOGO.png" alt="Zeal Education Logo" class="logo" />
      <h1>Reset Your Password</h1>
      <p>Dear ${data.name},</p>
      <p>We received a request to reset your password. Click the button below to set a new one:</p>
      <a href="${process.env.frontendurl}/reset-password/${data.token}" class="button">Reset Password</a>
      <p>If you did not request this password reset, you can safely ignore this email.</p>
      <div class="footer">
        This is an automated message from Zeal Elearning Platform. Please do not reply to this email.
      </div>
    </div>
  </body>
  </html>`;

  await transport.sendMail({
    from: process.env.Gmail,
    to: data.email,
    subject,
    html,
  });
};

export const sendPurchaseMail = async (email, subject, data) => {
  const transport = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.Gmail,
      pass: process.env.Password,
    },
  });

  const html = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Course Purchase Confirmation - Zeal Education</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #e6f2ff;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
      }
      .container {
        background-color: #ffffff;
        padding: 40px 25px;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 500px;
        text-align: center;
      }
      .logo {
        width: 120px;
        margin-bottom: 20px;
      }
      h1 {
        color: #0077cc;
        font-size: 24px;
        margin-bottom: 10px;
      }
      p {
        color: #333;
        font-size: 16px;
        margin: 10px 0;
      }
      .course-details {
        background-color: #f8f9fa;
        padding: 20px;
        border-radius: 8px;
        margin: 20px 0;
        text-align: left;
      }
      .course-details h3 {
        color: #0077cc;
        margin-bottom: 10px;
      }
      .course-details p {
        margin: 5px 0;
      }
      .button {
        display: inline-block;
        padding: 12px 25px;
        margin: 25px 0;
        background-color: #0077cc;
        color: #ffffff;
        text-decoration: none;
        border-radius: 5px;
        font-weight: bold;
        font-size: 16px;
      }
      .footer {
        font-size: 12px;
        color: #777;
        margin-top: 30px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <img src="https://sp-ao.shortpixel.ai/client/q_glossy,ret_img/https://zealeducation.com/wp-content/uploads/2017/02/ZEAL-LOGO.png" alt="Zeal Education Logo" class="logo" />
      <h1>Course Purchase Confirmation</h1>
      <p>Dear ${data.name},</p>
      <p>Thank you for your purchase! We're excited to have you join our learning community.</p>
      
      <div class="course-details">
        <h3>Course Details</h3>
        <p><strong>Course Name:</strong> ${data.courseName}</p>
        <p><strong>Amount Paid:</strong> ₹${data.amount}</p>
        <p><strong>Transaction ID:</strong> ${data.transactionId}</p>
        <p><strong>Purchase Date:</strong> ${new Date(data.purchaseDate).toLocaleDateString()}</p>
      </div>

      <p>You can now access your course materials by logging into your account.</p>
      <a href="${data.courseLink}" class="button">Access Your Course</a>
      
      <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
      
      <div class="footer">
        This is an automated message from Zeal Elearning Platform. Please do not reply to this email.
      </div>
    </div>
  </body>
  </html>`;

  await transport.sendMail({
    from: process.env.Gmail,
    to: email,
    subject,
    html,
  });
};
