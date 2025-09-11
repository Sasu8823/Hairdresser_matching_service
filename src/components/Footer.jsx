import React from "react";
import "./Footer.css"; // optional separate styling

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <p>© {new Date().getFullYear()} Hairdresser Match. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
