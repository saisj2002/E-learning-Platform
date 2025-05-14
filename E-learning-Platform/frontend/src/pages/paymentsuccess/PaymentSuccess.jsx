import React, { useEffect } from "react";
import "./paymentsuccess.css";
import { Link, useParams, useNavigate } from "react-router-dom";
import { CourseData } from "../../context/CourseContext";

const PaymentSuccess = ({ user }) => {
  const params = useParams();
  const navigate = useNavigate();
  const { fetchMyCourse } = CourseData();

  useEffect(() => {
    // Fetch updated course data
    fetchMyCourse();
    
    // Redirect to dashboard after 3 seconds
    const timer = setTimeout(() => {
      navigate(`/${user._id}/dashboard`);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="payment-success-page">
      {user && (
        <div className="success-message">
          <h2>Payment successful</h2>
          <p>Your course subscription has been activated</p>
          <p>Reference no - {params.id}</p>
          <p>Redirecting to dashboard...</p>
          <Link to={`/${user._id}/dashboard`} className="common-btn">
            Go to Dashboard
          </Link>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;
