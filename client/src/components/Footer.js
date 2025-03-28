import React from "react";
import "../Styles/Footer.css";
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-columns">
        <div className="footer-column">
          <h3><span> <strong style={{fontSize:"30px"}}>RC</strong><strong style={{color:"tomato"}}>code_EDITOR</strong></span></h3>
          <p>
            Empowering developers with knowledge, tools, and inspiration to
            build the future.
          </p>
        </div>
        <div className="footer-column">
          <h4>Quick Links</h4>
          <ul>
            <li>Home</li>
            <li>About</li>
            <li>Services</li>
            <li>Contact</li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>Contact</h4>
          <ul>
            <li>Email: RTCCE@GMAIL.COM</li>
            <li>Phone: +91 790 2139 430</li>
            <li>Address: pani ki tanki mathura</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">© 2025 Rc Code_EDITOR. All Rights Reserved.</div>
    </footer>
  );
};

export default Footer;
