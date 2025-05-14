import React, { useState } from 'react';
import './search.css';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('title'); // 'title' or 'createdBy'

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm, searchBy);
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-container">
          <input
            type="text"
            placeholder={`Search by ${searchBy === 'title' ? 'course title' : 'instructor'}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            <i className="fas fa-search"></i> Search
          </button>
        </div>
        <div className="search-options">
          <label>
            <input
              type="radio"
              name="searchBy"
              value="title"
              checked={searchBy === 'title'}
              onChange={(e) => setSearchBy(e.target.value)}
            />
            Search by Title
          </label>
          <label>
            <input
              type="radio"
              name="searchBy"
              value="createdBy"
              checked={searchBy === 'createdBy'}
              onChange={(e) => setSearchBy(e.target.value)}
            />
            Search by Instructor
          </label>
        </div>
      </form>
    </div>
  );
};

export default SearchBar; 