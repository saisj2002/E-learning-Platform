import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../main";
import Layout from "../Utils/Layout";
import "./certificateReports.css";
import toast from "react-hot-toast";

const CertificateReports = ({ user }) => {
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    } else {
      fetchCertificates();
    }
  }, [user, navigate]);

  async function fetchCertificates() {
    try {
      setLoading(true);
      const { data } = await axios.get(`${server}/api/admin/report-data`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      
      if (data && data.certificates) {
        setCertificates(data.certificates);
      } else {
        toast.error("No certificate data received");
      }
    } catch (error) {
      console.error("Error fetching certificates:", error);
      toast.error(error.response?.data?.message || "Failed to fetch certificates");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="certificate-container">
        <div className="certificate-card1">
          <h1 className="certificate-title">Certificate Reports</h1>
          <div className="table-wrapper">
            {loading ? (
              <div className="loading">Loading certificates...</div>
            ) : (
              <table className="certificate-table">
                <thead>
                  <tr>
                    <th>Sr. No.</th>
                    <th>User Name</th>
                    <th>Course Name</th>
                    <th>ZPRN</th>
                    <th>Issue Date</th>
                    <th>Certificate ID</th>
                  </tr>
                </thead>
                <tbody>
                  {certificates && certificates.length > 0 ? (
                    certificates.map((cert, i) => (
                      <tr key={cert._id}>
                        <td>{i + 1}</td>
                        <td>{cert.user?.name || "N/A"}</td>
                        <td>{cert.course?.title || "N/A"}</td>
                        <td>{cert.collegeID || "N/A"}</td>
                        <td>{new Date(cert.issuedAt || cert.createdAt).toLocaleDateString()}</td>
                        <td>{cert._id}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="no-data">
                        No certificates found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CertificateReports; 