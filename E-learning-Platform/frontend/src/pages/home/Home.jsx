import React from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";
import Testimonials from "../../components/testimonials/Testimonials";
import { UserData } from "../../context/UserContext";

const Home = () => {
  const navigate = useNavigate();
  const { isAuth } = UserData();
  console.log("isAuth", isAuth);

  return (
    <div className="hero-bg">
      <div className="hero-overlay">
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-subheading">Zeal Elearning Platform</div>
            <h1 className="hero-title">Get Educated Online<br />From Anywhere</h1>
            <p className="hero-desc">
              Zeal Institute of Business Administration, Computer Application and Research, Pune
            </p>
            <div className="hero-btns">
              <button className="hero-btn hero-btn-primary" onClick={() => navigate("/courses")}>Get Started</button>
              {!isAuth && (
                <button className="hero-btn hero-btn-secondary" onClick={() => navigate("/login")}>Login</button>
              )}
            </div>
          </div>
          <img
            src="https://saisj2002.github.io/Images/College%20Logo.png"
            alt="Zeal Logo"
            className="hero-logo"
          />
        </div>
      </div>
      <Testimonials />
    </div>
  );
};

export default Home;
