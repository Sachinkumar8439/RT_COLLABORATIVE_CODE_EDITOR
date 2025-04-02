import React, { useState } from "react";
import userControllers from "../Controllers/user";
import "../Styles/AuthForm.css";
import { useNavigate } from "react-router-dom";

export default function AuthForm() {
  const [error, seterror] = useState("");
  const navigate = useNavigate();
  const [islogin, setislogin] = useState(false);
  const [data, setdata] = useState({
    name:"",
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("data", data);
    if (islogin) {
      const result = await userControllers.loginuser("/log-in", {
        email: data.email,
        password: data.password,
      });
      if (result.success) {
        console.log("result", result);
        navigate(`/editor/${result.user._id}`, { state: result.user });
        return;
      }
      seterror(result.message);
      return;
    }

    if(data.confirmPassword !== data.password){
      alert("confirm Password and Password Should be Same");
      return;
    }
    const result = await userControllers.createuser('/sign-up',data);
    if (result.success) {
      console.log("result", result);
      navigate(`/editor/${result.user._id}`, { state: result.user });
      return;
    }
    seterror(result.message);
    return;



  };

  return (
    <div style={{display:'flex'}} className="auth-container">
      <div style={{flex:'1'}}>
      <div className="nuxt-container" style={{borderBottomRightRadius:'30%'}}>
      <p className="breadcrumbs">&gt; Code Fast With Other</p>
      <h1 className="nuxt-title">&lt; <strong style={{fontSize:'70px'}}>RTC</strong>code_EDITOR /&gt;</h1>
      <p className="nuxt-description">
        The <span className="tag">Real Time Collaborative Code_editor</span>
      </p>
      <div className="nuxt-logo">&#9650;</div>
    </div>

      </div>
      <div 
     
      className="form-container">
        <h2 className="form-title">
          {islogin ? "Login Account" : "Create Account"}
        </h2>
        <p className="form-description">
          {islogin
            ? "Enter your credentials to login"
            : "Enter data for registration"}
        </p>
        <form onSubmit={handleSubmit}  className="form"
         style={{ height: islogin ? "170px" : "320px",}} 
        >
          {!islogin && (
            <>
              <input
                type="text"
                placeholder="Name"
                required
                className="input"
                onChange={(e) =>
                  setdata({ ...data, name: e.target.value })
                }
              />
              
              <input
                type="text"
                placeholder="Username"
                required
                className="input"
                onChange={(e) => setdata({ ...data, userName: e.target.value })}
              />
            </>
          )}
          <input
            type="email"
            placeholder="Email"
            required
            className="input"
            onChange={(e) => setdata({ ...data, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            required
            className="input"
            onChange={(e) => setdata({ ...data, password: e.target.value })}
          />
          {!islogin && (
            <input
              type="password"
              placeholder="confirm Password"
              required
              className="input"
              onChange={(e) =>
                setdata({ ...data, confirmPassword: e.target.value })
              }
            />
          )}

          <p className="error">{error}</p>
          <button type="submit" className="submit-btn">
            {islogin ? "LOG IN" : "SIGN UP"}
          </button>
        </form>
        <p className="switch-text">
          {islogin ? "Don't have an Account?" : "Already have an Account?"}{" "}
          <button className="switch-btn" onClick={() => 
          {
            seterror(''); setislogin(!islogin)}
          }
            >
            {islogin ? "Jump to Signup" : "Jump to Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
