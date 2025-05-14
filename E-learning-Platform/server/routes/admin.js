import express from "express";
import { isAdmin, isAuth } from "../middlewares/isAuth.js";
import { User } from "../models/User.js";
import { Payment } from "../models/Payment.js";
import { Courses } from "../models/Courses.js";
import { Certificate } from "../models/Certificate.js";
import {
  addLectures,
  createCourse,
  deleteCourse,
  deleteLecture,
  getAllStats,
  getAllUser,
  updateRole,
} from "../controllers/admin.js";
import { uploadFiles } from "../middlewares/multer.js";

const router = express.Router();

router.post("/course/new", isAuth, isAdmin, uploadFiles, createCourse);
router.post("/course/:id", isAuth, isAdmin, uploadFiles, addLectures);
router.delete("/course/:id", isAuth, isAdmin, deleteCourse);
router.delete("/lecture/:id", isAuth, isAdmin, deleteLecture);
router.get("/stats", isAuth, isAdmin, getAllStats);
router.get("/users", isAuth, isAdmin, getAllUser);
router.put("/user/:id", isAuth, isAdmin, updateRole);

// Reports API Route
router.get("/admin/report-data", isAuth, isAdmin, async (req, res) => {
  try {
    // Get all users
    const users = await User.find({});
    const userCount = users.filter(u => u.role === "user").length;
    const adminCount = users.filter(u => u.role === "admin").length;

    // Get all courses
    const courses = await Courses.find({});
    const totalCourses = courses.length;
    const coursesList = courses.map(course => course.title);

    // Get all payments
    const payments = await Payment.find({});

    // Count purchases per course
    const coursePurchaseMap = {};
    payments.forEach(payment => {
      if (payment.courseId) {
        const key = payment.courseId.toString();
        coursePurchaseMap[key] = (coursePurchaseMap[key] || 0) + 1;
      }
    });

    // Prepare course reports
    const courseReports = courses.map(course => ({
      _id: course._id,
      name: course.title,
      purchasedBy: coursePurchaseMap[course._id.toString()] || 0,
    }));

    // Get all certificates
    const certificates = await Certificate.find()
      .populate("user")
      .populate("course");

    res.json({
      userCount,
      adminCount,
      totalCourses,
      coursesList,
      courseReports,
      payments,
      certificates,
    });
  } catch (err) {
    console.error("Report data error:", err);
    res.status(500).json({ error: "Failed to fetch report data" });
  }
});

export default router;
