import React from "react";
import "./dashbord.css";
import { CourseData } from "../../context/CourseContext";
import CourseCard from "../../components/coursecard/CourseCard";
import { UserData } from "../../context/UserContext";

const Dashbord = ({ user }) => {
  const { mycourse, courses } = CourseData();
  
  // For admin/super admin, show all courses
  // For regular users, show only purchased courses
  const coursesToDisplay = user && (user.role === "admin" || user.role === "superadmin") 
    ? courses 
    : mycourse;

  return (
    <div className="courses1">
      <h2>{user && (user.role === "admin" || user.role === "superadmin") ? "All Courses" : "My Enrolled Courses"}</h2>
      <div className="course-container-for-cource-card1">
        {coursesToDisplay && coursesToDisplay.length > 0 ? (
          coursesToDisplay.map((e) => <CourseCard key={e._id} course={e} />)
        ) : (
          <p>{user && (user.role === "admin" || user.role === "superadmin") ? "No courses available" : "Buy a course & start learning..."}</p>
        )}
      </div>
    </div>
  );
};

export default Dashbord;
