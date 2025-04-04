import React, { useContext, useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";
import projectlogo from "../media/Images/project_logo.webp";
import "../Styles/Hero.css";
import { StateContext } from "../Context/usecontext";
const Hero = () => {
  const [token,setToken] = useState(localStorage.getItem('token'));
  const {isTokenValid} = useContext(StateContext);

  useEffect(() =>{
    if(!isTokenValid(token)){
      localStorage.removeItem('token');
      setToken(null);
    }
  },[token]);

  const naviagte = useNavigate();
  return (
    <div className="hero">
      <div className="hero-left">
        <h1>Let's Code <strong style={{color:"tomato"}}>TOGETHER</strong> </h1>
        <p>
        Collaborate in real-time with our powerful code editor. Write, edit, and share code seamlessly with your team. Boost productivity and bring ideas to life together!
        </p>
        {
          token === null? <button onClick={()=>
          
            naviagte("/Authorization")} className="hero-button">Get Start</button>: <button onClick={()=>
          
              naviagte(`/editor/${token}`)} className="hero-button">Go To Editor</button>
        }
       
      </div>
      <div className="hero-right">
        <img
          src={projectlogo}
          alt="Hero"
          className="hero-image"
        />
      </div>
    </div>
  );
};

export default Hero;
