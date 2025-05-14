import React, { useState } from "react";
import "./register.css";
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "../../context/UserContext";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const navigate = useNavigate();
  const { btnLoading, registerUser } = UserData();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [college, setCollege] = useState("");
  const [mobile, setMobile] = useState("");
  const [collegeID, setCollegeID] = useState("");
  const [dob, setDob] = useState("");
  const [zprnError, setZprnError] = useState("");

  const validateZPRN = (zprn) => {
    if (!zprn) return "ZPRN is required";
    if (!/^[a-zA-Z0-9]+$/.test(zprn)) return "ZPRN must contain only letters and numbers";
    if (zprn.length !== 9) return "ZPRN must be exactly 9 characters";
    return "";
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return "Password must be at least 8 characters long";
    }
    if (!hasUpperCase) {
      return "Password must contain at least one uppercase letter";
    }
    if (!hasNumber) {
      return "Password must contain at least one number";
    }
    if (!hasSymbol) {
      return "Password must contain at least one symbol";
    }
    return null;
  };

  const validateMobile = (mobile) => {
    // Check if mobile is exactly 10 digits
    if (mobile.length !== 10) {
      return "Mobile number must be exactly 10 digits";
    }
    
    // Check if mobile contains only numbers
    if (!/^\d+$/.test(mobile)) {
      return "Mobile number must contain only digits";
    }
    
    return null;
  };

  const handleMobileChange = (e) => {
    const value = e.target.value;
    // Only allow numbers and limit to 10 digits
    if (/^\d*$/.test(value) && value.length <= 10) {
      setMobile(value);
    }
  };

  const getMaxLength = (college) => {
    switch (college) {
      case "ZIBACAR":
        return 9;
      case "ZCOER":
        return 7;
      case "ZIMCA":
        return 8;
      case "Zeal Polytechnic":
        return 10;
      case "Zeal ITI":
        return 12;
      default:
        return 0;
    }
  };

  const handleZprnChange = (e) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
    if (value.length <= 9) {
      setCollegeID(value);
      // Only show error if there's a value and it's invalid
      if (value) {
        setZprnError(validateZPRN(value));
      } else {
        setZprnError("");
      }
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    
    // Password validation
    const passwordError = validatePassword(password);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    // Confirm password check
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // College validation
    if (!college) {
      toast.error("Please select a college");
      return;
    }

    // Mobile validation
    const mobileError = validateMobile(mobile);
    if (mobileError) {
      toast.error(mobileError);
      return;
    }

    // ZPRN validation
    const zprnError = validateZPRN(collegeID);
    if (zprnError) {
      toast.error(zprnError);
      return;
    }

    await registerUser(name, email, password, department, college, mobile, collegeID, dob, navigate);
  };

  return (
    <div className="register-page-horizontal">
      <div className="register-form-horizontal">
        <h2>Register</h2>
        <form onSubmit={submitHandler} className="register-form-fields-horizontal">
          <div className="register-field-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
            required
          />
          </div>
          <div className="register-field-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
            required
          />
          </div>
          <div className="register-field-group">
          <label htmlFor="password">Password</label>
            <div className="password-input-container">
          <input
                type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                required
              />
              <span 
                className="password-toggle" 
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <div className="register-field-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="password-input-container">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                required
              />
              <span 
                className="password-toggle" 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                title={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <div className="register-field-group">
            <label htmlFor="college">College</label>
            <select
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              required
            >
              <option value="">Select College</option>
              <option value="ZIBACAR">ZIBACAR</option>
              <option value="ZCOER">ZCOER</option>
              <option value="ZIMCA">ZIMCA</option>
              <option value="Zeal Polytechnic">Zeal Polytechnic</option>
              <option value="Zeal ITI">Zeal ITI</option>
            </select>
          </div>
          <div className="register-field-group">
            <label htmlFor="department">Department</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
            >
              <option value="">Select Department</option>
              <option value="MCA">MCA</option>
              <option value="MBA">MBA</option>
              <option value="BE">BE</option>
              <option value="BTech">BTech</option>
              <option value="Polytechnique">Polytechnique</option>
              <option value="ITI">ITI</option>
            </select>
          </div>
          <div className="register-field-group">
            <label htmlFor="mobile">Mobile Number</label>
            <input
              type="tel"
              value={mobile}
              onChange={handleMobileChange}
              placeholder="Enter 10 digit mobile number"
              maxLength="10"
              required
            />
          </div>
          <div className="register-field-group">
            <label htmlFor="collegeID">ZPRN</label>
            <input
              type="text"
              value={collegeID}
              onChange={handleZprnChange}
              placeholder="Enter your ZPRN (9 characters)"
              required
              maxLength={9}
              style={{ borderColor: zprnError ? '#ff4444' : '' }}
            />
            {zprnError && (
              <small className="password-hint" style={{ color: '#ff4444', display: 'block', marginTop: '5px' }}>
                {zprnError}
              </small>
            )}
          </div>
          <div className="register-field-group">
            <label htmlFor="dob">Date of Birth</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            required
          />
          </div>
          <button type="submit" disabled={btnLoading} className="common-btn">
            {btnLoading ? "Please Wait..." : "Register"}
          </button>
        </form>
        <p>
          have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
