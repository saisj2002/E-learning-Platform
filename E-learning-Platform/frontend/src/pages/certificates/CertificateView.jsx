import React, { useEffect, useState } from "react";
import axios from "axios";
import { server } from "../../main";
import "./CertificateViewBlueTheme.css";
import { FaDownload, FaShare } from "react-icons/fa";
import { toast } from "react-hot-toast";

const CertificateView = ({ certificateId }) => {
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCertificate() {
      try {
        const { data } = await axios.get(`${server}/api/user/certificates/${certificateId}`, {
        headers: { token: localStorage.getItem("token") }
      });
        if (data && data.certificate) {
      setCertificate(data.certificate);
        } else {
          setError("Certificate not found");
        }
      } catch (err) {
        console.error("Error fetching certificate:", err);
        setError("Failed to fetch certificate. Please try again later.");
      }
    }
    fetchCertificate();
  }, [certificateId]);

  const handleDownload = async () => {
    try {
      const response = await axios.get(`${server}/api/user/certificates/${certificateId}/download`, {
        headers: { 
          token: localStorage.getItem("token"),
          'Content-Type': 'application/pdf'
        },
        responseType: 'blob'
      });
      
      // Create a blob from the response
      const blob = new Blob([response.data], { type: 'application/pdf' });
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certificate-${certificateId}.pdf`);
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      // Clean up the URL object
      window.URL.revokeObjectURL(url);
      
      toast.success("Certificate downloaded successfully!");
    } catch (error) {
      console.error("Error downloading certificate:", error);
      toast.error("Failed to download certificate. Please try again.");
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${certificate.course?.title} Certificate`,
          text: `I completed the ${certificate.course?.title} course!`,
          url: window.location.href
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Certificate link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing certificate:", error);
      toast.error("Failed to share certificate");
    }
  };

  if (error) {
    return <div className="certificates-container">{error}</div>;
  }

  if (!certificate) {
    return <div className="certificates-container">Loading certificate...</div>;
  }

  // Dynamic data
  const logoUrl = "https://saisj2002.github.io/Images/College%20Logo.png";
  const orgName = "Zeal Institute of Business Administration, Computer Application and Research";
  const orgAddress = "Narhe, Pune, Maharashtra, India";
  const signatoryName = "Director";
  const signatoryTitle = "Zeal Education Platform";
  const signatoryImageUrl = "https://saisj2002.github.io/Images/Signature.png";

  return (
    <div className="certificate-view-container">
      <div className="certificate-actions">
        <button onClick={handleDownload} className="certificate-action-btn download-btn">
          <FaDownload /> Download
        </button>
        <button onClick={handleShare} className="certificate-action-btn share-btn">
          <FaShare /> Share
        </button>
      </div>
      <div className="blue-cert-outer">
        {/* Blue/white corners */}
        <div className="blue-corner blue-corner-topright"></div>
        <div className="blue-corner blue-corner-bottomleft"></div>
        {/* Badge */}
        <img src={logoUrl} alt="Logo" className="blue-logo-alone" />
        <div className="blue-cert-content">
          <div className="blue-cert-title">CERTIFICATE<br />OF COMPLETION</div>
          <div className="blue-cert-presented">PROUDLY PRESENTED TO</div>
          <div className="blue-cert-name">{certificate.user?.name || "Unknown User"}</div>
          <div className="blue-cert-body">
            This is to certify that <b>{certificate.user?.name || "Unknown User"}</b> has successfully completed the <b>{certificate.course?.title || "Unknown Course"}</b> course.<br />
            Awarded on <b>{new Date(certificate.issuedAt).toLocaleDateString()}</b>.<br />
            {orgName}, {orgAddress}
          </div>
          <div className="blue-cert-signatures">
            <div className="blue-cert-signature-block">
              <div className="blue-cert-signature-line"></div>
              <div className="blue-cert-signature-label">Signature</div>
            </div>
          </div>
          <div className="blue-cert-id">ZPRN: {certificate.collegeID}</div>
          <div className="blue-cert-id">Certificate ID: {certificate._id}</div>
      </div>
      </div>
    </div>
  );
};

export default CertificateView;