import React from "react";
import { MdDashboard } from "react-icons/md";
import "./account.css";
import { IoMdLogOut } from "react-icons/io";
import { FaCertificate, FaUserCircle } from "react-icons/fa"; // Add avatar icon
import { UserData } from "../../context/UserContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Account = ({ user }) => {
  const { setIsAuth, setUser } = UserData();
  const navigate = useNavigate();

  console.log(user._id)
  
  const logoutHandler = () => {
    localStorage.clear();
    setUser([]);
    setIsAuth(false);
    toast.success("Logged Out");
    navigate("/login");
  };

  return (
    <div>
      {user && (
        <div className="profile modern-profile-card">
          <div className="profile-avatar-top">
            <FaUserCircle className="profile-avatar" />
            <div className="profile-name">{user.name}</div>
            <div className="profile-email">{user.email}</div>
          </div>
          <div className="profile-content-row">
            <div className="profile-info-modern">
              <div className="profile-info-row">
                <span className="profile-label">Department:</span>
                <span className="profile-value">{user.department || "-"}</span>
              </div>
              <div className="profile-info-row">
                <span className="profile-label">Mobile:</span>
                <span className="profile-value">{user.mobile || "-"}</span>
              </div>
              <div className="profile-info-row">
                <span className="profile-label">College ID:</span>
                <span className="profile-value">{user.collegeID || "-"}</span>
              </div>
              <div className="profile-info-row">
                <span className="profile-label">Date of Birth:</span>
                <span className="profile-value">{user.dob ? new Date(user.dob).toLocaleDateString() : "-"}</span>
              </div>
            </div>
            <div className="profile-actions-modern">
            <button
              onClick={() => navigate(`/${user._id}/dashboard`)}
              className="common-btn"
            >
              My Courses
            </button>
            {user.role === "admin" && (
              <button
                onClick={() => navigate(`/admin/dashboard`)}
                className="common-btn"
              >
                Admin Dashboard
              </button>
            )}
            <button
              onClick={() => navigate("/certificates")}
              className="common-btn"
            >
              <FaCertificate style={{ marginRight: "8px", marginBottom: "-3px" }} />
              My Certificates
            </button>
            <button
              onClick={logoutHandler}
              className="common-btn logout-btn"
            >
              <IoMdLogOut />
              Logout
            </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
