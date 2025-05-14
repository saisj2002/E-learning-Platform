import React from "react";
import "./footer.css";
import {
  AiFillFacebook,
  AiFillTwitterSquare,
  AiFillInstagram,
  AiFillYoutube,
} from "react-icons/ai";

const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        <p style={{marginBottom:"10px"}}>
        Our Vision is “To empower society with holistic development through quality education. <br />
        Our Mission which is “To enrich knowledge with enhanced facilities to help Zeal students structure their careers to a glorious future and to develop the students as a resource within and outside the organization through holistic focus on character building and integral student development through an array of curricular, co-curricular and extra-curricular activities.
        </p>
        <div className="social-links">
          <a href="https://www.facebook.com/ZealInstitutes/">
            <AiFillFacebook />
          </a>
          <a href="https://x.com/ZealInstitutes">
            <AiFillTwitterSquare />
          </a>
          <a href="https://www.youtube.com/user/zealedusoc">
            <AiFillYoutube />
          </a>
          <a href="https://www.instagram.com/zeal_institutes/">
            <AiFillInstagram />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
