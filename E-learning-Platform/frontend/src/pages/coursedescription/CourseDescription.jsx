import React, { useEffect, useState } from "react";
import "./coursedescription.css";
import { useNavigate, useParams } from "react-router-dom";
import { CourseData } from "../../context/CourseContext";
import { server } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { UserData } from "../../context/UserContext";
import Loading from "../../components/loading/Loading";

const CourseDescription = ({ user }) => {
  const params = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const { fetchUser } = UserData();
  const { fetchCourse, course, fetchCourses, fetchMyCourse } = CourseData();

  useEffect(() => {
    fetchCourse(params.id);
  }, []);

  const checkoutHandler = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);

    try {
    const {
        data: { order, course },
    } = await axios.post(
      `${server}/api/course/checkout/${params.id}`,
      {},
      {
        headers: {
          token,
        },
      }
    );

    const options = {
      key: "rzp_test_1tK7yAY7ByvjWB",
        amount: order.amount,
      currency: "INR",
      name: "Zeal Elearning Platform",
        description: course.title,
      order_id: order.id,
      handler: async function (response) {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;

        try {
          const { data } = await axios.post(
            `${server}/api/verification/${params.id}`,
            {
              razorpay_order_id,
              razorpay_payment_id,
              razorpay_signature,
            },
            {
              headers: {
                token,
              },
            }
          );

          await fetchUser();
          await fetchCourses();
          await fetchMyCourse();
          toast.success(data.message);
          setLoading(false);
          navigate(`/payment-success/${razorpay_payment_id}`);
        } catch (error) {
          toast.error(error.response.data.message);
          setLoading(false);
        }
      },
        prefill: {
          name: user.name,
          email: user.email,
        },
      theme: {
        color: "#0051ff",
      },
    };
    const razorpay = new window.Razorpay(options);
    razorpay.open();
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          {course && (
            <div className="course-description-container">
              <div className="course-header">
                <div className="course-image-wrapper">
                  <img
                    src={`${server}/${course.image}`}
                    alt={course.title}
                    className="course-image"
                  />
                </div>
                <div className="course-info">
                  <h2 className="course-title">{course.title}</h2>
                  <p className="course-instructor"><h4>Instructor: {course.createdBy}</h4></p>
                  <p className="course-duration"><h4>Duration: {course.duration} weeks</h4></p>
                </div>
              </div>

              <div className="course-description">
                <p><h4>Description: </h4> <br />{course.description}</p>
              </div>

              <div className="course-price">
                <p>Let's get started with the course at ₹{course.price}</p>
              </div>

              <div className="course-action">
                {user && user.subscription.includes(course._id) ? (
                  <button onClick={() => navigate(`/course/study/${course._id}`)} className="common-btn">
                    Study
                  </button>
                ) : (
                  <button onClick={checkoutHandler} className="common-btn">
                    Buy Now
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default CourseDescription;
