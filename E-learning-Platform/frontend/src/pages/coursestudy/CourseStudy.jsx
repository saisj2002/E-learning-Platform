import React, { useEffect, useState } from "react"; 
import "./coursestudy.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CourseData } from "../../context/CourseContext";
import { server } from "../../main";
import axios from "axios";

const CourseStudy = ({ user }) => {
  const params = useParams();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [hasCertificate, setHasCertificate] = useState(false);

  const { fetchCourse, course } = CourseData();

  if (user && user.role !== "admin" && !user.subscription.includes(params.id))
    return navigate("/");

  useEffect(() => {
    fetchCourse(params.id);
    fetchProgress();
    checkCertificate();
  }, [params.id]);

  const fetchProgress = async () => {
    try {
      const { data } = await axios.get(
        `${server}/api/user/progress?course=${params.id}`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      setProgress(data.courseProgressPercentage);
    } catch (error) {
      console.log(error);
    }
  };

  const checkCertificate = async () => {
    try {
      const { data } = await axios.get(
        `${server}/api/user/certificates`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      
      if (data.certificates) {
        const hasCert = data.certificates.some(cert => cert.course._id === params.id);
        setHasCertificate(hasCert);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {course && (
        <div className="course-study-page">
          <div className="course-study-wrapper">
            <div className="course-study-header">
              <img
                src={`${server}/${course.image}`}
                alt={course.title}
                className="course-study-image"
              />
              <div className="course-study-info">
                <h2 className="course-study-title">Subject - {course.title}</h2>
                <h6 className="course-study-meta">By - {course.createdBy}</h6>
                <h6 className="course-study-meta">Duration - {course.duration} weeks</h6>
                <div className="progress-bar">
                  <progress value={progress} max={100}></progress>
                  <span>{progress}% Complete</span>
                </div>
              </div>
            </div>

            <div className="course-study-description">
              <h3>Description</h3>
              <p>{course.description}</p>
            </div>

            <div className="course-study-actions">
              <Link to={`/lectures/${course._id}`} className="course-study-link">
                <h1>Lectures</h1>
              </Link>
              {(progress === 100 || hasCertificate) && (
                <Link to="/certificates" className="course-study-link">
                  <h1>{hasCertificate ? "View Certificate" : "Get Certificate"}</h1>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CourseStudy;
