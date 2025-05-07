import React from "react";
import "./Header.scss";

const Header = () => {
  return (
    <header className="header">
      <div className="container header-container">
        <div className="logo">
          <h1>CampusGPA</h1>
          <p className="tagline">GPA Calculator for Sri Lankan Universities</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
