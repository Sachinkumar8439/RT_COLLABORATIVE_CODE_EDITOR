import React, { useContext, useEffect, useState } from "react";
import { StateContext } from "../Context/usecontext";
import { Codingsection} from "./Codingsection";
import InputSection from "./Inputsection";
import OutputSection from "./Outputsection";
import "../Styles/Maineditor.css";
import { useSocket } from "../Context/SocketContetx";
import { useNavigate } from "react-router-dom";
import HtmlPreview from "./htmlPreview";


const Maineditor = () => {
  const navigate = useNavigate();
  const [htmlcode,sethtmlcode] = useState("")
  const [showPreview, setShowPreview] = useState(false);
  const { output, setoutput, isTokenValid,token,settoken,user,setuser} = useContext(StateContext);
  
  const socket = useSocket();

  const intervel = setInterval(() => {
    if(!isTokenValid(token)){
      settoken(null)
      clearInterval(intervel);
    }
  }, 5000);
  useEffect(()=>{
      if(!isTokenValid(token)){
          if(user){
           localStorage.clear();
           sessionStorage.clear();
            setuser(null);
            navigate("/notice");
          }
      }
      return clearInterval(intervel)
      
    },[token])


  return (
    <div className="main-editor">
      <Codingsection sethtmlcode={sethtmlcode} setShowPreview={setShowPreview} socket={socket} user={user} />
      <div className="input-output-container">
        <InputSection />
        <OutputSection data={{ output, setoutput }} />
      <HtmlPreview
        content={htmlcode}
        visible={showPreview}
        onClose={() => setShowPreview(false)}
      />
      </div>
    </div>
  );
};

export default Maineditor;
