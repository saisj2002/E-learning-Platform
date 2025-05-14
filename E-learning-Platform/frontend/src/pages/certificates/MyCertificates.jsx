import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { server } from "../../main";
import "./MyCertificates.css";
import { FaCertificate } from "react-icons/fa";

const MyCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCertificates() {
      try {
        const { data } = await axios.get(`${server}/api/user/certificates`, {
          headers: { token: localStorage.getItem("token") }
        });
        console.log("Certificate data:", data); // Debug log
        if (data && data.certificates) {
          setCertificates(data.certificates);
        } else {
          setCertificates([]);
        }
      } catch (err) {
        console.error("Error fetching certificates:", err);
        setError("Failed to fetch certificates. Please try again later.");
        setCertificates([]);
      } finally {
        setLoading(false);
      }
    }
    fetchCertificates();
  }, []);

  if (loading) {
    return <div className="certificates-container">Loading certificates...</div>;
  }

  if (error) {
    return <div className="certificates-container">{error}</div>;
  }

  return (
    <div className="certificates-container">
      <h2 className="certificates-title">🎓 My Certificates</h2>
      {certificates.length === 0 ? (
        <div className="no-certificates">No certificates yet.</div>
      ) : (
        <div className="certificates-grid">
          {certificates.map(cert => (
            <Link
              to={`/certificates/${cert._id}`}
              key={cert._id}
              className="certificate-card-link"
              style={{ textDecoration: "none" }}
            >
              <div className="certificate-card">
           
                <div className="certificate-header">
                  <div className="certificate-header-left">
                    <span className="certificate-icon">
                      <FaCertificate style={{ fontSize: '1.5em', color: '#2563eb' }} />
                    </span>
                    <span className="certificate-course">{cert.course?.title || "Unknown Course"}</span>
                  </div>
                  <div className="certificate-header-right">
                    <b>Issued:</b> {new Date(cert.issuedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCertificates;