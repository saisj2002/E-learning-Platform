import React from "react";
import "./about.css";

const About = () => {
  return (
    <div className="about">
      <div className="about-content">
        <h2>
          About Us<br />
          <u>Zeal Institute of Business Administration, Computer Application and Research</u>
        </h2>
        <hr />
        <p>
          The Zeal Institute of Business Administration, Computer Application and Research is a top Management Institute approved by AICTE, New Delhi, recognized by DTE Govt. of Maharashtra & affiliated to Savitribai Phule Pune University. We conduct MBA & MCA programs and are committed to excellence in teaching, learning, and holistic development.
        </p>
        <p>
          The Institute is run by Zeal Education Society, which was established in 1996 and has set up multiple centers of educational excellence. With 20 years of presence in the academic sector, we will continue to redefine excellence for the future. We believe in delivering world-class education and nurturing careers with dedicated faculty and continuous interaction with industry experts.
        </p>
        <hr />
        <div style={{ textAlign: 'right' }}>
          <a href="https://zealeducation.com/" target="_blank" rel="noopener noreferrer">
            <button style={{ backgroundColor: '#0051ff', borderRadius: '8px', color: 'white', padding: '10px 20px', border: 'none', height: '60px', fontSize: '18px' }}>
              About ZES
            </button>
          </a>
      
      
          <a href="https://zibacar.in/" target="_blank" rel="noopener noreferrer">
            <button style={{ backgroundColor: '#0051ff', borderRadius: '8px', color: 'white', padding: '10px 20px', border: 'none', height: '60px', fontSize: '18px',marginLeft: '10px' }}>
              About ZIBACAR
            </button>
          </a>
         </div>
      </div>
      
    </div>
  );
};

export default About;
