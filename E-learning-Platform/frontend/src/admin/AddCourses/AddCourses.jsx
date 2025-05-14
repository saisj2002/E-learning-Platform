import React, { useState } from "react";
import Layout from "../Utils/Layout";
import { useNavigate } from "react-router-dom";
import { CourseData } from "../../context/CourseContext";
import toast from "react-hot-toast";
import axios from "axios";
import { server } from "../../main";
import "./admincourses.css";

const categories = [
  "Web Development",
  "App Development",
  "Game Development",
  "Data Science",
  "Artificial Intelligence",
];

const AddCourses = ({ user }) => {
  const navigate = useNavigate();

  if (user && user.role !== "admin") return navigate("/");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [duration, setDuration] = useState("");
  const [image, setImage] = useState("");
  const [imagePrev, setImagePrev] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);

  const changeImageHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImagePrev(reader.result);
      setImage(file);
    };
  };

  const { fetchCourses } = CourseData();

  const submitHandler = async (e) => {
    e.preventDefault();
    setBtnLoading(true);
    const myForm = new FormData();
    myForm.append("title", title);
    myForm.append("description", description);
    myForm.append("category", category);
    myForm.append("price", price);
    myForm.append("createdBy", createdBy);
    myForm.append("duration", duration);
    myForm.append("file", image);
    try {
      const { data } = await axios.post(`${server}/api/course/new`, myForm, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      toast.success(data.message);
      setBtnLoading(false);
      await fetchCourses();
      setImage("");
      setTitle("");
      setDescription("");
      setDuration("");
      setImagePrev("");
      setCreatedBy("");
      setPrice("");
      setCategory("");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <Layout>
      <div className="adminco">
        <div className="admin-courses">
          <div className="course-form">
            <h2>Add Course</h2>
            <form onSubmit={submitHandler}>
              <div className="form-group">
                <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
              </div>
              <div className="form-group">
                <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
                <input type="text" placeholder="Created By" value={createdBy} onChange={(e) => setCreatedBy(e.target.value)} required />
              </div>
              <div className="form-group">
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="">Select Category</option>
                  {categories.map((e) => (
                    <option value={e} key={e}>{e}</option>
                  ))}
                </select>
                <input type="number" placeholder="Duration (in Weeks)" value={duration} onChange={(e) => setDuration(e.target.value)} required />
              </div>
              <div className="form-group">
                <input type="file" required onChange={changeImageHandler} />
                {imagePrev && <img src={imagePrev} alt="" className="preview-image" />}
              </div>
              <button type="submit" disabled={btnLoading} className="submit-btn">
                {btnLoading ? "Please Wait..." : "Add"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddCourses;
