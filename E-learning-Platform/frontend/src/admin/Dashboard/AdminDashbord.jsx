import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../Utils/Layout";
import axios from "axios";
import { server } from "../../main";
import "./adminDashboard.css";

const AdminDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({});

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    } else {
      fetchStats();
    }
  }, [user, navigate]);

  async function fetchStats() {
    try {
      const { data } = await axios.get(`${server}/api/stats`, {
        headers: { token: localStorage.getItem("token") },
      });
      setStats(data.stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }

  // Define all possible dashboard items
  const allDashboardItems = [
    { label: "Total Courses", value: stats.totalCoures, link: "/admin/course-reports", img: "book.png" },
    { label: "Total Lectures", value: stats.totalLectures, link: "/admin/lectures-report", img: "lectures.png" },
    { label: "Total Users", value: stats.totalUsers, link: "/admin/users", img: "users.png", superadminOnly: true },
    { label: "Sales Reports", value: "", link: "/admin/reports", img: "reports.png", buttonText: "View Sales", superadminOnly: true },
    { label: "Certificates Report", value: "", link: "/admin/certificate-reports", img: "certificate.png", buttonText: "View Certificates" },
    { label: "New Courses", value: "", link: "/admin/addcourses", img: "add%20course.png", buttonText: "Add Courses" },
    { label: "Update Lectures", value: "", link: "/admin/course", img: "update%20lecture.png", buttonText: "Edit Lectures" },
    { label: "Update User Role", value: "", link: "/admin/users", img: "update%20role.png", buttonText: "Edit Role", superadminOnly: true }
  ];

  // Filter dashboard items based on user role
  const dashboardItems = allDashboardItems.filter(item => 
    !item.superadminOnly || (user && user.mainrole === "superadmin")
  );

  return (
    <Layout>
      <div className="pd">
      <div className="student-dashboard11">
        <h2 style={{fontSize: "2rem", marginBottom:"30px"}}>Admin Dashboard</h2>
        <div className="dashboard-content1">
          {dashboardItems.map(({ label, value, link, img, buttonText = "View" }, index) => (
            <div className="box" key={index}>
              <img src={`https://saisj2002.github.io/Images/${img}`} alt={label} />
              <div>
                <p>{label}: <b>{value}</b></p>
                <button onClick={() => navigate(link)} className="common-btn">
                  {buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
