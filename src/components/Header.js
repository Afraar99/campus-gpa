import React from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import "./Header.scss";

const Header = ({ darkMode, toggleDarkMode }) => {
  return (
    <header className="header">
      <div className="container header-container">
        <div className="logo">
          <h1>CampusGPA</h1>
        </div>
        <button
          className="theme-toggle-btn"
          onClick={toggleDarkMode}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>
    </header>
  );
};

export default Header;
