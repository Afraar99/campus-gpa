import React from "react";
import "./Footer.scss";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p>
          &copy; {new Date().getFullYear()} CampusGPA - GPA Calculator for Sri
          Lankan University Students. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
