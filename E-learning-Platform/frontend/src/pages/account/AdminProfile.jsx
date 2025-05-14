import React from "react";
import { IoMdLogOut } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { UserData } from "../../context/UserContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "./account.css";

const AdminProfile = ({ user }) => {
  const { setIsAuth, setUser } = UserData();
  const navigate = useNavigate();
  
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
            <div className="profile-role">Administrator</div>
          </div>
          <div className="profile-content-row">
            <div className="profile-actions-modern admin-actions">
              <button
                onClick={() => navigate(`/admin/dashboard`)}
                className="common-btn admin-btn"
              >
                Admin Dashboard
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

export default AdminProfile; 