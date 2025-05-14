import React, { useState, useEffect } from "react";
import Layout from "../Utils/Layout";
import axios from "axios";
import { server } from "../../main";
import "./reports.css";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const CourseReports = () => {
  const [loading, setLoading] = useState(true);
  const [courseReports, setCourseReports] = useState([]);
  const [coursesList, setCoursesList] = useState([]);
  const [openSection, setOpenSection] = useState({
    coursesList: true,
    purchasesTable: false,
    pieChart: false,
  });

  const toggleSection = (section) => {
    setOpenSection((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  useEffect(() => {
    async function fetchReports() {
      try {
        const { data } = await axios.get(`${server}/api/admin/report-data`, {
          headers: { token: localStorage.getItem("token") },
        });
        setCourseReports(data.courseReports);
        setCoursesList(data.courseReports.map(c => c.name));
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    fetchReports();
  }, []);

  // Prepare pie chart data
  const pieData = {
    labels: courseReports.map(c => c.name),
    datasets: [
      {
        label: "Users Purchased",
        data: courseReports.map(c => c.purchasedBy),
        backgroundColor: [
          "#007bff", "#28a745", "#ffc107", "#dc3545", "#17a2b8", "#6610f2", "#fd7e14", "#6f42c1"
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Layout>
      <div className="student-dashboard111">
        <div className="reports-page">
          <div className="reports-main-content">
            <h2 className="reports-title">Course Reports</h2> <br />
            {loading ? (
              <p>Loading...</p>
            ) : (
              <>
                <div className="card-grid">
                  <div className="report-box">
                    <h3>Total Courses</h3>
                    <p>{courseReports.length}</p>
                  </div>
                  <div className="report-box">
                    <h3>Total Purchases</h3>
                    <p>{courseReports.reduce((sum, course) => sum + course.purchasedBy, 0)}</p>
                  </div>
                  <div className="report-box">
                    <h3>Most Popular Course</h3>
                    <p>
                      {courseReports.length > 0
                        ? courseReports.reduce((max, course) => 
                            course.purchasedBy > max.purchasedBy ? course : max, courseReports[0]).name
                        : "N/A"}
                    </p>
                  </div>
                  <div className="report-box">
                    <h3>Average Purchases per Course</h3>
                    <p>
                      {courseReports.length > 0
                        ? (courseReports.reduce((sum, course) => sum + course.purchasedBy, 0) / courseReports.length).toFixed(1)
                        : 0}
                    </p>
                  </div>
                </div>

                {/* Courses List */}
                <div className="report-section">
                  <h3
                    className="collapsible-title"
                    onClick={() => toggleSection("coursesList")}
                    style={{ cursor: "pointer", userSelect: "none" }}
                  >
                    Courses List
                    <span className="dropdown-arrow">
                      {openSection.coursesList ? "▲" : "▼"}
                    </span>
                  </h3>
                  {openSection.coursesList && (
                    <table className="report-table" style={{ borderCollapse: "collapse" }}>
                      <thead>
                        <tr>
                          <th style={{ borderBottom: "2px solid #ddd", borderRight: "1px solid #ddd" }}>Sr. <br />No.</th>
                          <th style={{ borderBottom: "2px solid #ddd" }}>Course Name</th>
                        </tr>
                      </thead>
                      <tbody>
                        {coursesList.map((course, idx) => (
                          <tr key={idx}>
                            <td style={{ borderBottom: "1px solid #ddd", borderRight: "1px solid #ddd" }}>{idx + 1}</td>
                            <td style={{ borderBottom: "1px solid #ddd" }}>{course}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

                {/* Course Purchases Table */}
                <div className="report-section">
                  <h3
                    className="collapsible-title"
                    onClick={() => toggleSection("purchasesTable")}
                    style={{ cursor: "pointer", userSelect: "none" }}
                  >
                    Course Purchases Table
                    <span className="dropdown-arrow">
                      {openSection.purchasesTable ? "▲" : "▼"}
                    </span>
                  </h3>
                  {openSection.purchasesTable && (
                    <table className="report-table" style={{ borderCollapse: "collapse" }}>
                      <thead>
                        <tr>
                          <th style={{ borderBottom: "2px solid #ddd", borderRight: "1px solid #ddd" }}>Course</th>
                          <th style={{ borderBottom: "2px solid #ddd" }}>Purchased By (Users)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {courseReports.map((c, idx) => (
                          <tr key={idx}>
                            <td style={{ borderBottom: "1px solid #ddd", borderRight: "1px solid #ddd" }}>{c.name}</td>
                            <td style={{ borderBottom: "1px solid #ddd" }}>{c.purchasedBy}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

                {/* Pie Chart */}
                <div className="report-section">
                  <h3
                    className="collapsible-title"
                    onClick={() => toggleSection("pieChart")}
                    style={{ cursor: "pointer", userSelect: "none" }}
                  >
                    Course Purchases Pie Chart
                    <span className="dropdown-arrow">
                      {openSection.pieChart ? "▲" : "▼"}
                    </span>
                  </h3>
                  {openSection.pieChart && (
                    <div style={{ maxWidth: 500, margin: "0 auto" }}>
                      <Pie
                        data={pieData}
                        options={{
                          plugins: {
                            title: {
                              display: true,
                              text: "Course Purchases Distribution"
                            }
                          },
                          cutout: "60%",
                        }}
                      />
                    </div>
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

export default CourseReports; 