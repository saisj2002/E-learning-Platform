import React, { useState, useEffect } from "react";
import Layout from "../Utils/Layout";
import axios from "axios";
import { server } from "../../main";
import "./reports.css";

const LecturesReport = () => {
  const [loading, setLoading] = useState(true);
  const [lectures, setLectures] = useState([]);
  const [courses, setCourses] = useState([]);
  const [openSection, setOpenSection] = useState({
    lecturesTable: true,
    courseBreakdown: false,
  });

  const toggleSection = (section) => {
    setOpenSection((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch courses data
        const coursesResponse = await axios.get(`${server}/api/admin/report-data`, {
          headers: { token: localStorage.getItem("token") },
        });
        
        const coursesData = coursesResponse.data.courseReports || [];
        setCourses(coursesData);
        
        // Fetch lectures for each course
        const allLectures = [];
        for (const course of coursesData) {
          try {
            const lectureResponse = await axios.get(`${server}/api/lectures/${course._id}`, {
              headers: { token: localStorage.getItem("token") },
            });
            
            if (lectureResponse.data.lectures && lectureResponse.data.lectures.length > 0) {
              // Add courseId to each lecture for reference
              const lecturesWithCourseId = lectureResponse.data.lectures.map(lecture => ({
                ...lecture,
                courseId: course._id
              }));
              allLectures.push(...lecturesWithCourseId);
            }
          } catch (err) {
            console.error(`Error fetching lectures for course ${course._id}:`, err);
          }
        }
        
        setLectures(allLectures);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  // Group lectures by course
  const lecturesByCourse = {};
  lectures.forEach(lecture => {
    const courseId = lecture.courseId;
    if (!lecturesByCourse[courseId]) {
      lecturesByCourse[courseId] = [];
    }
    lecturesByCourse[courseId].push(lecture);
  });

  // Calculate total lectures
  const totalLectures = lectures.length;

  // Get course name by ID
  const getCourseName = (courseId) => {
    const course = courses.find(c => c._id === courseId);
    return course ? course.name : "Unknown Course";
  };

  return (
    <Layout>
      <div className="student-dashboard111">
        <div className="reports-page">
          <div className="reports-main-content">
            <h2 className="reports-title">Lectures Report</h2> <br />
            {loading ? (
              <p>Loading...</p>
            ) : (
              <>
                <div className="card-grid">
                  <div className="report-box">
                    <h3>Total Lectures</h3>
                    <p>{totalLectures}</p>
                  </div>
                  <div className="report-box">
                    <h3>Total Courses</h3>
                    <p>{courses.length}</p>
                  </div>
                  <div className="report-box">
                    <h3>Average Lectures per Course</h3>
                    <p>{courses.length > 0 ? (totalLectures / courses.length).toFixed(1) : 0}</p>
                  </div>
                  <div className="report-box">
                    <h3>Courses with Most Lectures</h3>
                    <p>
                      {Object.keys(lecturesByCourse).length > 0
                        ? getCourseName(Object.entries(lecturesByCourse)
                            .reduce((max, [_, lectures]) => 
                              lectures.length > max[1].length ? [_, lectures] : max, 
                              [Object.keys(lecturesByCourse)[0], lecturesByCourse[Object.keys(lecturesByCourse)[0]]])[0])
                        : "N/A"}
                    </p>
                  </div>
                </div>

                {/* All Lectures Table */}
                <div className="report-section">
                  <h3
                    className="collapsible-title"
                    onClick={() => toggleSection("lecturesTable")}
                    style={{ cursor: "pointer", userSelect: "none" }}
                  >
                    All Lectures
                    <span className="dropdown-arrow">
                      {openSection.lecturesTable ? "▲" : "▼"}
                    </span>
                  </h3>
                  {openSection.lecturesTable && (
                    <table className="report-table" style={{ borderCollapse: "collapse" }}>
                      <thead>
                        <tr>
                          <th style={{ borderBottom: "2px solid #ddd", borderRight: "1px solid #ddd" }}>Sr. No.</th>
                          <th style={{ borderBottom: "2px solid #ddd", borderRight: "1px solid #ddd" }}>Course</th>
                          <th style={{ borderBottom: "2px solid #ddd" }}>Lecture Title</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lectures.map((lecture, idx) => (
                          <tr key={idx}>
                            <td style={{ borderBottom: "1px solid #ddd", borderRight: "1px solid #ddd" }}>{idx + 1}</td>
                            <td style={{ borderBottom: "1px solid #ddd", borderRight: "1px solid #ddd" }}>
                              {getCourseName(lecture.courseId)}
                            </td>
                            <td style={{ borderBottom: "1px solid #ddd" }}>
                              {lecture.title}
                            </td>
                          </tr>
                        ))}
                        <tr style={{ fontWeight: "bold", backgroundColor: "#f8f9fa" }}>
                          <td style={{ borderBottom: "1px solid #ddd", borderRight: "1px solid #ddd" }} colSpan="2">Total</td>
                          <td style={{ borderBottom: "1px solid #ddd" }}>{totalLectures}</td>
                        </tr>
                      </tbody>
                    </table>
                  )}
                </div>

                {/* Course Breakdown */}
                <div className="report-section">
                  <h3
                    className="collapsible-title"
                    onClick={() => toggleSection("courseBreakdown")}
                    style={{ cursor: "pointer", userSelect: "none" }}
                  >
                    Course Breakdown
                    <span className="dropdown-arrow">
                      {openSection.courseBreakdown ? "▲" : "▼"}
                    </span>
                  </h3>
                  {openSection.courseBreakdown && (
                    <table className="report-table" style={{ borderCollapse: "collapse" }}>
                      <thead>
                        <tr>
                          <th style={{ borderBottom: "2px solid #ddd", borderRight: "1px solid #ddd" }}>Course</th>
                          <th style={{ borderBottom: "2px solid #ddd", borderRight: "1px solid #ddd" }}>Total Lectures</th>
                          <th style={{ borderBottom: "2px solid #ddd" }}>Lecture Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {courses.map((course, idx) => {
                          const courseLectures = lecturesByCourse[course._id] || [];
                          return (
                            <tr key={idx}>
                              <td style={{ borderBottom: "1px solid #ddd", borderRight: "1px solid #ddd" }}>{course.name}</td>
                              <td style={{ borderBottom: "1px solid #ddd", borderRight: "1px solid #ddd" }}>{courseLectures.length}</td>
                              <td style={{ borderBottom: "1px solid #ddd" }}>
                                {courseLectures.length > 0 ? (
                                  <ul style={{ listStyleType: "none", padding: 0 }}>
                                    {courseLectures.map((lecture, lIdx) => (
                                      <li key={lIdx} style={{ marginBottom: "5px" }}>
                                        {lecture.title}
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  "No lectures"
                                )}
                              </td>
                            </tr>
                          );
                        })}
                        <tr style={{ fontWeight: "bold", backgroundColor: "#f8f9fa" }}>
                          <td style={{ borderBottom: "1px solid #ddd", borderRight: "1px solid #ddd" }}>Total</td>
                          <td style={{ borderBottom: "1px solid #ddd", borderRight: "1px solid #ddd" }}>{totalLectures}</td>
                          <td style={{ borderBottom: "1px solid #ddd" }}></td>
                        </tr>
                      </tbody>
                    </table>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LecturesReport; 