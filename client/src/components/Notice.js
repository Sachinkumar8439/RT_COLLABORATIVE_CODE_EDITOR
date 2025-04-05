import React from "react";
import { useNavigate } from "react-router-dom";

const NotificationBox = ({ heading, para, btntext }) => {
  const navigate = useNavigate();

  const wrapperStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    // background: "linear-gradient(135deg, #e0f7ff, #c7d2fe)", // light gradient background
    background:"none",
  };

  const boxStyle = {
    padding: "30px",
    background: "linear-gradient(135deg, #f0f9ff, #dbeafe)",
    border: "1px solid #93c5fd",
    borderRadius: "16px",
    color: "#1e3a8a",
    fontFamily: "Arial, sans-serif",
    fontSize: "16px",
    maxWidth: "420px",
    width: "90%",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  };

  const buttonStyle = {
    marginTop: "20px",
    padding: "12px 24px",
    backgroundColor: "#0284c7",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "bold",
    transition: "background-color 0.3s ease",
  };

  const handleNavigation = () => {
    navigate("/target-route"); // Change to your actual path
  };

  return (
    <div style={wrapperStyle}>
      <div style={boxStyle}>
        <h2>{heading}</h2>
        <p>{para}</p>
        <button
          style={buttonStyle}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#0369a1")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#0284c7")}
          onClick={handleNavigation}
        >
          {btntext}
        </button>
      </div>
    </div>
  );
};

export default NotificationBox;
