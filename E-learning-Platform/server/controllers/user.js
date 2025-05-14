import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendMail, { sendForgotMail } from "../middlewares/sendMail.js";
import TryCatch from "../middlewares/TryCatch.js";
import { Progress } from "../models/Progress.js";
import { Lecture } from "../models/Lecture.js";
import { Certificate } from "../models/Certificate.js"; // Make sure this import is at the top
import PDFDocument from "pdfkit";
import axios from "axios";

export const register = TryCatch(async (req, res) => {
  const { email, name, password, department, college, mobile, collegeID, dob } = req.body;

  let user = await User.findOne({ email });

  if (user)
    return res.status(400).json({
      message: "User Already exists",
    });

  const hashPassword = await bcrypt.hash(password, 10);

  user = {
    name,
    email,
    password: hashPassword,
    department,
    college,
    mobile,
    collegeID,
    dob,
  };

  const otp = Math.floor(Math.random() * 1000000);

  const activationToken = jwt.sign(
    {
      user,
      otp,
    },
    process.env.Activation_Secret,
    {
      expiresIn: "5m",
    }
  );

  const data = {
    name,
    otp,
  };

  await sendMail(email, "E learning", data);

  res.status(200).json({
    message: "OTP send to your mail",
    activationToken,
  });
});

export const verifyUser = TryCatch(async (req, res) => {
  const { otp, activationToken } = req.body;

  const verify = jwt.verify(activationToken, process.env.Activation_Secret);

  if (!verify)
    return res.status(400).json({
      message: "OTP Expired",
    });

  if (verify.otp !== otp)
    return res.status(400).json({
      message: "Wrong OTP",
    });

  // Create the user and get the created user object
  const user = await User.create({
    name: verify.user.name,
    email: verify.user.email,
    password: verify.user.password,
    department: verify.user.department,
    college: verify.user.college,
    mobile: verify.user.mobile,
    collegeID: verify.user.collegeID,
    dob: verify.user.dob,
  });

  // Optionally, create a JWT token for the user
  const token = jwt.sign({ _id: user._id }, process.env.Jwt_Sec, {
    expiresIn: "15d",
  });

  res.json({
    message: "User Registered",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  });
});

export const loginUser = TryCatch(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user)
    return res.status(400).json({
      message: "No User with this email",
    });

  const mathPassword = await bcrypt.compare(password, user.password);

  if (!mathPassword)
    return res.status(400).json({
      message: "wrong Password",
    });

  const token = jwt.sign({ _id: user._id }, process.env.Jwt_Sec, {
    expiresIn: "15d",
  });

  res.json({
    message: `Welcome back ${user.name}`,
    token,
    user,
  });
});

export const myProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);

  res.json({ user });
});

export const forgotPassword = TryCatch(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user)
    return res.status(404).json({
      message: "No User with this email",
    });

  const token = jwt.sign({ email }, process.env.Forgot_Secret);

  const data = { email, token };

  await sendForgotMail("E learning", data);

  user.resetPasswordExpire = Date.now() + 5 * 60 * 1000;

  await user.save();

  res.json({
    message: "Reset Password Link is send to you mail",
  });
});

export const resetPassword = TryCatch(async (req, res) => {
  const decodedData = jwt.verify(req.query.token, process.env.Forgot_Secret);

  const user = await User.findOne({ email: decodedData.email });

  if (!user)
    return res.status(404).json({
      message: "No user with this email",
    });

  if (user.resetPasswordExpire === null)
    return res.status(400).json({
      message: "Token Expired",
    });

  if (user.resetPasswordExpire < Date.now()) {
    return res.status(400).json({
      message: "Token Expired",
    });
  }

  const password = await bcrypt.hash(req.body.password, 10);

  user.password = password;

  user.resetPasswordExpire = null;

  await user.save();

  res.json({ message: "Password Reset" });
});

export const getUserCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({ user: req.user._id })
      .populate({
        path: 'course',
        select: 'title _id'
      })
      .populate({
        path: 'user',
        select: 'name collegeID'
      });
    
    res.json({ certificates });
  } catch (error) {
    console.error("Error fetching certificates:", error);
    res.status(500).json({ message: "Error fetching certificates" });
  }
};

export const getCertificateById = async (req, res) => {
  const certificate = await Certificate.findById(req.params.id)
    .populate("user")
    .populate("course");
  if (!certificate) return res.status(404).json({ message: "Not found" });
  res.json({ certificate });
};

export const downloadCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id)
      .populate("user")
      .populate("course");
    
    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    // Create a PDF document
    const doc = new PDFDocument({
      size: 'A4',
      layout: 'landscape',
      margins: {
        top: 50,
        bottom: 50,
        left: 50,
        right: 50
      }
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=certificate-${certificate._id}.pdf`);

    // Pipe the PDF to the response
    doc.pipe(res);

    // Define margins for centering content
    const marginLeft = doc.page.margins.left;
    const usableWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;

    // Add background and border
    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#f8fafc');
    doc.rect(40, 40, doc.page.width - 80, doc.page.height - 80)
       .lineWidth(2)
       .stroke('#1d4ed8');

    // Add decorative corners
    const cornerSize = 20;
    const cornerColor = '#1d4ed8';
    doc.moveTo(doc.page.width - 40, 40)
       .lineTo(doc.page.width - 40, 40 + cornerSize)
       .lineTo(doc.page.width - 40 - cornerSize, 40)
       .fill(cornerColor);
    doc.moveTo(40, doc.page.height - 40)
       .lineTo(40, doc.page.height - 40 - cornerSize)
       .lineTo(40 + cornerSize, doc.page.height - 40)
       .fill(cornerColor);

    // Add logo from remote source
    const logoUrl = 'https://saisj2002.github.io/Images/College%20Logo.png';
    const logoWidth = 100;
    const logoHeight = 100;
    const logoX = (doc.page.width - logoWidth) / 2;
    const logoY = 60;
    try {
      const responseLogo = await axios.get(logoUrl, { responseType: 'arraybuffer' });
      const logoBuffer = responseLogo.data;
      doc.image(logoBuffer, logoX, logoY, { width: logoWidth, height: logoHeight });
    } catch (error) {
      console.log("Error fetching or embedding logo, continuing without logo");
    }

    // Add certificate title
    doc.fontSize(32)
       .fillColor('#1d4ed8')
       .text('CERTIFICATE OF COMPLETION', marginLeft, logoY + logoHeight + 20, { align: 'center', width: usableWidth });

    // Add presented text
    doc.moveDown();
    doc.fontSize(18).fillColor('#444');
    doc.text('PROUDLY PRESENTED TO', marginLeft, doc.y, { align: 'center', width: usableWidth });

    // Add student name
    doc.moveDown();
    doc.fontSize(28).fillColor('#1d4ed8');
    doc.text(certificate.user.name, marginLeft, doc.y, { align: 'center', width: usableWidth });

    // Add certificate body
    doc.moveDown();
    doc.fontSize(16).fillColor('#333');
    doc.text(`This is to certify that ${certificate.user.name} has successfully completed the ${certificate.course.title} course. Awarded on: ${new Date(certificate.issuedAt).toLocaleDateString()}`, marginLeft, doc.y, { align: 'center', width: usableWidth });

    // Add organization details
    const orgName = "Zeal Institute of Business Administration, Computer Application and Research";
    const orgAddress = "Narhe, Pune, Maharashtra, India";
    doc.moveDown();
    doc.fontSize(16).fillColor('#333');
    doc.text(`${orgName}, ${orgAddress}`, marginLeft, doc.y, { align: 'center', width: usableWidth });

    // Add signature section
    const signatureY = doc.page.height - doc.page.margins.bottom - 40;
    
    // Add signature line
    doc.moveTo(doc.page.width/2 - 100, signatureY)
       .lineTo(doc.page.width/2 + 100, signatureY)
       .stroke('#1d4ed8');

    // Add signature label
    doc.fontSize(14)
       .fillColor('#1d4ed8')
       .text('Director Signature', marginLeft, signatureY + 14, { align: 'center', width: usableWidth });

    // Add footer certificate details at bottom-right
    doc.fontSize(8).fillColor('#333');
    const footerY = doc.page.height - doc.page.margins.bottom - 30;
    doc.text(`ZPRN: ${certificate.collegeID}`, marginLeft, footerY, { width: usableWidth, align: 'right' });
    doc.text(`Certificate ID: ${certificate._id}`, marginLeft, footerY + 15, { width: usableWidth, align: 'right' });

    // Finalize the PDF
    doc.end();
  } catch (error) {
    console.error("Error generating certificate PDF:", error);
    res.status(500).json({ message: "Error generating certificate PDF: " + error.message });
  }
};
