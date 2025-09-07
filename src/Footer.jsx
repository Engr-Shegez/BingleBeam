import React from "react";
import "./index.css";

const Footer = () => (
  <footer className="footer">
    <div className="footer-container">
      <div className="footer-logo">
        <span className="footer-logo-text">🎬 BingleBeam</span>
      </div>
      <div className="footer-links">
        <a href="#">Home</a>
        <a href="#">About</a>
        <a href="#">Services</a>
        <a href="#">Contact</a>
      </div>
      <div className="footer-social">
        <a href="#">
          <img src="/assets/facebook.svg" alt="Facebook" />
        </a>
        <a href="#">
          <img src="/assets/twitter.svg" alt="Twitter" />
        </a>
        <a href="#">
          <img src="/assets/instagram.svg" alt="Instagram" />
        </a>
      </div>
    </div>
    <div className="footer-bottom">
      <p>&copy; 2025 BingleBeam. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
