import React, { useState, useEffect } from "react";
import "./courses.css";
import { CourseData } from "../../context/CourseContext";
import CourseCard from "../../components/coursecard/CourseCard";
import SearchBar from "../../components/search/SearchBar";

const categories = [
  "Web Development",
  "App Development",
  "Game Development",
  "Data Science",
  "Artificial Intelligence",
];

const Courses = () => {
  const { courses, fetchCourses } = CourseData();
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("title");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (courses && courses.length > 0) {
      setFilteredCourses(courses);
    }
  }, [courses]);

  const handleSearch = (term, by) => {
    setSearchTerm(term);
    setSearchBy(by);
    
    if (!term.trim()) {
      setFilteredCourses(courses);
      return;
    }
    
    const lowerCaseTerm = term.toLowerCase();
    
    const filtered = courses.filter(course => {
      if (by === 'title') {
        return course.title.toLowerCase().includes(lowerCaseTerm);
      } else if (by === 'createdBy') {
        return course.createdBy.toLowerCase().includes(lowerCaseTerm);
      }
      return true;
    });
    
    setFilteredCourses(filtered);
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    if (!category) {
      setFilteredCourses(courses);
      return;
    }
    const filtered = courses.filter(course => course.category === category);
    setFilteredCourses(filtered);
  };

  return (
    <div className="courses">
      <h2>Available Courses</h2>
      
      <SearchBar onSearch={handleSearch} />

      <div className="category-filter">
        <button 
          className={`category-btn ${!selectedCategory ? 'active' : ''}`}
          onClick={() => handleCategoryFilter("")}
        >
          All Categories
        </button>
        {categories.map((category) => (
          <button
            key={category}
            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => handleCategoryFilter(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="course-container-for-cource-card">
        {filteredCourses && filteredCourses.length > 0 ? (
          filteredCourses.map((course) => <CourseCard key={course._id} course={course} />)
        ) : (
          <p>No courses found matching your search criteria.</p>
        )}
      </div>
    </div>
  );
};

export default Courses;
