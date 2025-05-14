import React from "react";
import "./certificate.css";

const Certificate = ({ certificate }) => {
  return (
    <div className="certificate">
      <div className="certificate-content">
        <h1>Certificate of Completion</h1>
        <p>This is to certify that</p>
        <h2>{certificate.user.name}</h2>
        <p>has successfully completed the course</p>
        <h3>{certificate.course.title}</h3>
        <p>College ID: {certificate.collegeID}</p>
        <p>Issued on: {new Date(certificate.issuedAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default Certificate; 