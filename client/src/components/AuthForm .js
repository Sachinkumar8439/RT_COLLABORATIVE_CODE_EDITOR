import React, { useEffect, useState ,useRef} from "react";
import userControllers from "../Controllers/user";
import "../Styles/AuthForm.css";
import { useNavigate } from "react-router-dom";
// import { json } from "body-parser";

export default function AuthForm() {
  const tempdata = (JSON.parse(localStorage.getItem('tempdata')) || null )
  const [isauto,setisauto] = useState(false);
  const [isAutomation, setIsAutomation] = useState(
    JSON.parse(localStorage.getItem("automation")) || false
  );  console.log("temp-data",tempdata);
  const [error, seterror] = useState("");
  const navigate = useNavigate();
  const formref = useRef(null);
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
        const data = {token :result.token,user:result.user}
        // localStorage.setItem('data',JSON.stringify(data))
        localStorage.setItem('token',result.token)
        console.log(localStorage);
        localStorage.setItem('tempdata',JSON.stringify({email:result.user.Email,password:result.user.Password}));

        navigate(`/editor/${result.user._id}`, { state: result.user });
        return;
      }
      seterror(result.message);
      return;
    }

    if(data.confirmPassword !== data.password){
      seterror("confirm Password and Password Should be Same");
      return;
    }
    const result = await userControllers.createuser('/sign-up',data);
    if (result.success) {
      console.log("result", result);
      localStorage.setItem('tempdata',JSON.stringify({email:result.user.Email,password:result.user.Password}));
     

      navigate(`/editor/${result.user._id}`, { state: result.user });
      return;
    }
    seterror(result.message);
    return;



  };


  useEffect(()=>{
    if(isauto)
    {
      formref.current.requestSubmit();


    }
    

  },[isauto])

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
            ?<> 
            Enter your credentials to login <br/>
            <span title="Write your password First" style={{fontSize:'15px',color:'lightGreen',marginRight:"5px"}}>Login Fast</span>
            <input
            type="checkbox"
            checked={isAutomation}
                onChange={(e) => {
                  localStorage.setItem("automation", JSON.stringify(e.target.checked));
                  setIsAutomation(e.target.checked);
            }}
          />
            </>
            : "Enter data for registration"}
        </p>
        <form ref={formref} onSubmit={handleSubmit}  className="form"
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
            value={data.email}
            className="input"
            onChange={(e) => setdata({ ...data, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={data.password}

            className="input"
            onChange={(e) => {
              setdata({ ...data, password: e.target.value });
              if(!isAutomation) return;
             let pass = e.target.value
             if(((pass.length === 6 || pass.length === tempdata.password.length) && tempdata) && pass === (tempdata.password).substring(0, pass.length))
              {
                setdata({ ...data, password: tempdata.password,email:tempdata.email });
                return setisauto(true);
        
              }
              setisauto(false)

             
            }
            }
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
