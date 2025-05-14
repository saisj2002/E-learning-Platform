import React from "react";
import "./common.css";
import { Link } from "react-router-dom";
import { AiFillHome, AiOutlineLogout } from "react-icons/ai";
import { FaBook, FaUserAlt, FaChartBar, FaChalkboardTeacher, FaCertificate } from "react-icons/fa";
import { UserData } from "../../context/UserContext";
import { PiCertificateBold } from "react-icons/pi";
import { IoHomeOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { BiBookAdd } from "react-icons/bi";

const Sidebar = () => {
  const { user } = UserData();
  return (
    <div className="sidebar">
      <ul>
        <li style={{height:"1px"}}></li>
        <li>
          <Link to={"/admin/dashboard"}>
            <div className="icon" style={{color:"blue"}}>
            <IoHomeOutline />
            </div>
            <span>Home</span>
          </Link>
        </li>

        <li>
          <Link to={"/admin/course"}>
            <div className="icon" style={{color:"blue"}}>
              <FaBook />
            </div>
            <span>Courses</span>
          </Link>
        </li>

        <li>
          <Link to={"/admin/addcourses"}>
            <div className="icon" style={{color:"blue"}}>
            <BiBookAdd />
            </div>
            <span>Add Courses</span>
          </Link>
        </li>

        {user && user.mainrole === "superadmin" && (
          <li>
            <Link to={"/admin/users"}>
              <div className="icon" style={{color:"blue"}}>
              <FaRegUser />
              </div>
              <span>Users</span>
            </Link>
          </li>
        )}

        {user && user.mainrole === "superadmin" && (
          <li>
            <Link to={"/admin/reports"}>
              <div className="icon" style={{color:"blue"}}>
                <FaChartBar />
              </div>
              <span>Sales</span>
            </Link>
          </li>
        )}

        {user && user.mainrole === "superadmin" && (
          <li>
            <Link to={"/admin/lectures-report"}>
              <div className="icon" style={{color:"blue"}}>
                <FaChalkboardTeacher />
              </div>
              <span>Lectures</span>
            </Link>
          </li>
        )}

        {user && user.mainrole === "superadmin" && (
          <li>
            <Link to={"/admin/certificate-reports"}>
              <div className="icon" style={{color:"blue"}}>
              <PiCertificateBold />
              </div>
              <span>Certificates</span>
            </Link>
          </li>
        )}

        <li>
          <Link to={"/account"}>
            <div className="icon" style={{color:"blue"}}>
              <AiOutlineLogout />
            </div>
            <span>Exit</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
