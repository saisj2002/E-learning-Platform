import React, { useEffect, useState } from "react";
import "./lecture.css";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { server } from "../../main";
import Loading from "../../components/loading/Loading";
import toast from "react-hot-toast";
import { TiTick } from "react-icons/ti";

const Lecture = ({ user }) => {
  const [lectures, setLectures] = useState([]);
  const [lecture, setLecture] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lecLoading, setLecLoading] = useState(false);
  const [show, setShow] = useState(false);
  const params = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setvideo] = useState("");
  const [videoPrev, setVideoPrev] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const [hasCertificate, setHasCertificate] = useState(false);

  if (user && user.role !== "admin" && !user.subscription.includes(params.id))
    return navigate("/");

  async function fetchLectures() {
    try {
      const { data } = await axios.get(`${server}/api/lectures/${params.id}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      setLectures(data.lectures);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  async function fetchLecture(id) {
    setLecLoading(true);
    try {
      const { data } = await axios.get(`${server}/api/lecture/${id}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      setLecture(data.lecture);
      setLecLoading(false);
    } catch (error) {
      console.log(error);
      setLecLoading(false);
    }
  }

  const changeVideoHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setVideoPrev(reader.result);
      setvideo(file);
    };
  };

  const submitHandler = async (e) => {
    setBtnLoading(true);
    e.preventDefault();
    const myForm = new FormData();

    myForm.append("title", title);
    myForm.append("description", description);
    myForm.append("file", video);

    try {
      const { data } = await axios.post(
        `${server}/api/course/${params.id}`,
        myForm,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      toast.success(data.message);
      setBtnLoading(false);
      setShow(false);
      fetchLectures();
      setTitle("");
      setDescription("");
      setvideo("");
      setVideoPrev("");
    } catch (error) {
      toast.error(error.response.data.message);
      setBtnLoading(false);
    }
  };

  const deleteHandler = async (id) => {
    if (confirm("Are you sure you want to delete this lecture")) {
      try {
        const { data } = await axios.delete(`${server}/api/lecture/${id}`, {
          headers: {
            token: localStorage.getItem("token"),
          },
        });

        toast.success(data.message);
        fetchLectures();
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  };

  const [completed, setCompleted] = useState("");
  const [completedLec, setCompletedLec] = useState("");
  const [lectLength, setLectLength] = useState("");
  const [progress, setProgress] = useState([]);

  async function fetchProgress() {
    try {
      const { data } = await axios.get(
        `${server}/api/user/progress?course=${params.id}`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      if (data) {
        setCompleted(data.courseProgressPercentage);
        setCompletedLec(data.completedLectures);
        setLectLength(data.allLectures);
        setProgress(data.progress);
      }
    } catch (error) {
      console.error("Error fetching progress:", error);
      toast.error("Error fetching progress");
    }
  }

  const addProgress = async (id) => {
    try {
      const { data } = await axios.post(
        `${server}/api/user/progress?course=${params.id}&lectureId=${id}`,
        {},
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      
      if (data) {
        if (data.certificateGenerated) {
          toast.success("Course completed! Certificate generated successfully!");
        } else {
          toast.success("Progress updated successfully!");
        }
        
        // Update local state
        setCompleted(data.courseProgressPercentage);
        setCompletedLec(data.completedLectures);
        setLectLength(data.allLectures);
        setProgress(data.progress);
      }
    } catch (error) {
      console.error("Error updating progress:", error);
      toast.error(error.response?.data?.message || "Error updating progress");
    }
  };

  console.log(progress);

  useEffect(() => {
    fetchLectures();
    fetchProgress();
    checkCertificate();
  }, []);

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
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="progress">
            Lectures completed - {completedLec} out of {lectLength} <br />
            <progress value={completed} max={100}></progress> {completed} %
          </div>
          <div className="lecture-page">
            <div className="left">
              {lecLoading ? (
                <Loading />
              ) : (
                <>
                  {lecture.video ? (
                    <>
                      <video
                        src={`${server}/${lecture.video}`}
                        width={"100%"}
                        controls
                        controlsList="nodownload noremoteplayback"
                        disablePictureInPicture
                        disableRemotePlayback
                        autoPlay
                        onEnded={() => addProgress(lecture._id)}
                      style={{boxShadow: "0 4px 12px rgba(0, 0, 0, 0.99)", borderRadius:"12px"}}></video>
                      <h2 style={{margin:"20px 0px", color:"black"}}>Lecture: {lecture.title}</h2>
                      <p style={{color:"black", marginBottom:"10px"}}>{lecture.description}</p>
                    </>
                  ) : (
                    <h1>Select a Lecture</h1>
                  )}
                </>
              )}
            </div>
            <div className="right">
              {user && user.role === "admin" && (
                <button className="common-btn" onClick={() => setShow(!show)}>
                  {show ? "Close" : "Add Lectures "}
                </button>
              )}

              {show && (
                <div className="lecture-form" style={{margin:"10px 0px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.99)"}}>
                  <h2>Add Lecture</h2>
                  <form onSubmit={submitHandler}>
                    <label htmlFor="text">Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />

                    <label htmlFor="text">Description</label>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />

                    <input
                      type="file"
                      placeholder="choose video"
                      onChange={changeVideoHandler}
                      required
                    />

                    {videoPrev && (
                      <video
                        src={videoPrev}
                        alt=""
                        width={300}
                        controls
                      ></video>
                    )}

                    <button
                      disabled={btnLoading}
                      type="submit"
                      className="common-btn"
                    >
                      {btnLoading ? "Please Wait..." : "Add"}
                    </button>
                  </form>
                </div>
              )}

              {lectures && lectures.length > 0 ? (
                lectures.map((e, i) => (
                  <>
                    <div
                      onClick={() => fetchLecture(e._id)}
                      key={i}
                      className={`lecture-number ${
                        lecture._id === e._id && "active"
                      }`}
                    >
                      {i + 1}. {e.title}{" "}
                      {progress[0] &&
                        progress[0].completedLectures.includes(e._id) && (
                          <span
                            style={{
                              background: "green",
                              padding: "15px 15px 5px 15px",
                              borderRadius: "3px",
                              color: "greenyellow"
                            }}
                          >
                            <TiTick style={{fontSize:"25px"}}/>
                          </span>
                        )}
                    </div>
                    {user && user.role === "admin" && (
                      <button
                        className="common-btn"
                        style={{ background: "red", justifyContent:"center" }}
                        onClick={() => deleteHandler(e._id)}
                      >
                        Delete {e.title}
                      </button>
                    )}
                  </>
                ))
              ) : (
                <p>Lectures to be upload</p>
              )}

              {(completed === 100 || hasCertificate) && (
                <Link to="/certificates" className="certificate-btn">
                  <h1>{hasCertificate ? "View Certificate" : "Get Certificate"}</h1>
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Lecture;
