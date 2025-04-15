import React from "react";
import { useNavigate } from "react-router-dom";

const NotificationBox = ({ heading, para, btntext }) => {
  const navigate = useNavigate();
  const { Heading , Para , Btntext } = {Heading:"SESSION EXPIRED",Para:'your session has been expired login again',Btntext:'Go to login'};


  const wrapperStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
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
    navigate("/"); 
  };

  return (
    <div style={wrapperStyle}>
      <div style={boxStyle}>
        <h2 style={{
          margin:'10px'
        }}>{heading || Heading }</h2>
        <p>{para || Para}</p>
        <button
          style={buttonStyle}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#0369a1")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#0284c7")}
          onClick={handleNavigation}
        >
          {btntext || Btntext}
        </button>
      </div>
    </div>
  );
};

export default NotificationBox;
