import { instance } from "../index.js";
import TryCatch from "../middlewares/TryCatch.js";
import { Courses } from "../models/Courses.js";
import { Lecture } from "../models/Lecture.js";
import { User } from "../models/User.js";
import crypto from "crypto";
import { Payment } from "../models/Payment.js";
import { Progress } from "../models/Progress.js";
import { Certificate } from "../models/Certificate.js";
import { sendPurchaseMail } from "../middlewares/sendMail.js";

export const getAllCourses = TryCatch(async (req, res) => {
  const courses = await Courses.find();
  res.json({
    courses,
  });
});

export const getSingleCourse = TryCatch(async (req, res) => {
  const course = await Courses.findById(req.params.id);

  res.json({
    course,
  });
});

export const fetchLectures = TryCatch(async (req, res) => {
  const lectures = await Lecture.find({ course: req.params.id });

  const user = await User.findById(req.user._id);

  if (user.role === "admin") {
    return res.json({ lectures });
  }

  if (!user.subscription.includes(req.params.id))
    return res.status(400).json({
      message: "You have not subscribed to this course",
    });

  res.json({ lectures });
});

export const fetchLecture = TryCatch(async (req, res) => {
  const lecture = await Lecture.findById(req.params.id);

  const user = await User.findById(req.user._id);

  if (user.role === "admin") {
    return res.json({ lecture });
  }

  if (!user.subscription.includes(lecture.course))
    return res.status(400).json({
      message: "You have not subscribed to this course",
    });

  res.json({ lecture });
});

export const getMyCourses = TryCatch(async (req, res) => {
  const courses = await Courses.find({ _id: req.user.subscription });

  res.json({
    courses,
  });
});

export const checkout = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);
  const course = await Courses.findById(req.params.id);

  if (user.subscription.includes(course._id)) {
    return res.status(400).json({
      message: "You already have this course",
    });
  }

  const options = {
    amount: Number(course.price * 100), // Convert to paise
    currency: "INR",
    receipt: `order_${Date.now()}`,
  };

  try {
  const order = await instance.orders.create(options);
  res.status(201).json({
    order,
    course,
  });
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    res.status(500).json({
      message: "Error creating payment order",
    });
  }
});

export const paymentVerification = TryCatch(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.Razorpay_Secret)
    .update(body)
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    try {
      // Find user and course
      const user = await User.findById(req.user._id);
      const course = await Courses.findById(req.params.id);

      if (!user || !course) {
        return res.status(404).json({
          message: "User or course not found",
        });
      }

      // Check if user already has the course
      if (user.subscription.includes(course._id)) {
        return res.status(400).json({
          message: "You already have this course",
        });
      }

      // Create payment record
    await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
        userId: req.user._id,
        courseId: req.params.id,
      });

      // Update user's subscription using findByIdAndUpdate to preserve all fields
      await User.findByIdAndUpdate(
        req.user._id,
        { $push: { subscription: course._id } },
        { new: true }
      );

      // Create progress record
    await Progress.create({
      course: course._id,
      completedLectures: [],
      user: req.user._id,
    });

      // Send purchase confirmation email
      await sendPurchaseMail(user.email, "Course Purchase Confirmation", {
        name: user.name,
        courseName: course.title,
        amount: course.price,
        transactionId: razorpay_payment_id,
        purchaseDate: new Date(),
        courseLink: `${process.env.FRONTEND_URL}/course/study/${course._id}`
      });

    res.status(200).json({
      message: "Course Purchased Successfully",
    });
    } catch (error) {
      console.error("Payment verification error:", error);
      res.status(500).json({
        message: "Error processing payment verification",
      });
    }
  } else {
    return res.status(400).json({
      message: "Payment Failed - Invalid signature",
    });
  }
});

export const addProgress = TryCatch(async (req, res) => {
  try {
    const { course, lectureId } = req.query;

    if (!course || !lectureId) {
      return res.status(400).json({
        message: "Course ID and Lecture ID are required",
      });
    }

    // Find or create progress
    let progress = await Progress.findOne({
    user: req.user._id,
      course: course,
  });

    if (!progress) {
      progress = await Progress.create({
        user: req.user._id,
        course: course,
        completedLectures: [],
      });
    }

    // Check if lecture is already completed
  if (progress.completedLectures.includes(lectureId)) {
    return res.json({
        message: "Lecture already completed",
    });
  }

    // Add lecture to completed lectures
  progress.completedLectures.push(lectureId);
  await progress.save();

    // Get total lectures count for the course
    const totalLectures = await Lecture.countDocuments({ course: course });
    
    // Check if course is completed (all lectures watched)
  if (progress.completedLectures.length === totalLectures) {
      // Check if certificate already exists
      const existingCertificate = await Certificate.findOne({ 
        user: req.user._id, 
        course: course 
      });

      if (!existingCertificate) {
        // Get user details
        const user = await User.findById(req.user._id);
        
        if (!user) {
          return res.status(404).json({
            message: "User not found",
          });
        }

        // Create new certificate
      await Certificate.create({
        user: req.user._id,
          course: course,
        issuedAt: new Date(),
          collegeID: user.collegeID,
        });

        return res.status(201).json({
          message: "Course completed and certificate generated",
          progress: progress.completedLectures.length,
          total: totalLectures,
          certificateGenerated: true
        });
      }
    }

    res.status(200).json({
      message: "Progress updated",
      progress: progress.completedLectures.length,
      total: totalLectures,
      certificateGenerated: false
    });
  } catch (error) {
    console.error("Error in addProgress:", error);
    res.status(500).json({
      message: "Error updating progress",
      error: error.message
    });
  }
});

export const getYourProgress = TryCatch(async (req, res) => {
  try {
    const { course } = req.query;

    if (!course) {
      return res.status(400).json({
        message: "Course ID is required",
      });
    }

    // Find progress for the user and course
    const progress = await Progress.findOne({
    user: req.user._id,
      course: course,
  });

    if (!progress) {
      // If no progress exists, create one
      const newProgress = await Progress.create({
        user: req.user._id,
        course: course,
        completedLectures: [],
      });

      return res.json({
        courseProgressPercentage: 0,
        completedLectures: 0,
        allLectures: 0,
        progress: [newProgress],
      });
    }

    // Get total lectures count
    const allLectures = await Lecture.countDocuments({ course: course });
    const completedLectures = progress.completedLectures.length;
    const courseProgressPercentage = allLectures > 0 
      ? Math.round((completedLectures * 100) / allLectures) 
      : 0;

  res.json({
    courseProgressPercentage,
    completedLectures,
    allLectures,
      progress: [progress],
    });
  } catch (error) {
    console.error("Error in getYourProgress:", error);
    res.status(500).json({
      message: "Error fetching progress",
      error: error.message,
  });
  }
});

export const getUserCertificates = async (req, res) => {
  const certificates = await Certificate.find({ user: req.user._id }).populate("course");
  // Add certificateUrl to each certificate object
  const certificatesWithUrl = certificates.map(cert => ({
    ...cert.toObject(),
    certificateUrl: `/certificates/${cert._id}`,
  }));
  res.json({ certificates: certificatesWithUrl });
};
