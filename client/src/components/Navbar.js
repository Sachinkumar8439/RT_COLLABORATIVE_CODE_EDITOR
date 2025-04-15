import React from "react";

import "../Styles/Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <span>
          {" "}
          <h1 style={{ fontSize: "15px" }} className="nuxt-title">
            &lt;<strong style={{ fontSize: "20px" }}>RTC</strong>code_EDITOR
            /&gt;
          </h1>
        </span>
      </div>

      <div className="nav-link-btn-div">
        <li>Home</li>
        <li>About</li>
        <li>Contact</li>
      </div>
    </nav>
  );
};

export default Navbar;
