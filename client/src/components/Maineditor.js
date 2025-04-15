import React, { useContext, useEffect, useState } from "react";
import { StateContext } from "../Context/usecontext";
import { Codingsection} from "./Codingsection";
import InputSection from "./Inputsection";
import OutputSection from "./Outputsection";
import "../Styles/Maineditor.css";
import { useSocket } from "../Context/SocketContetx";
import { useLocation } from "react-router-dom";

const Maineditor = () => {
  const location = useLocation();
  const [user, setuser] = useState(location.state);
  const { output, setoutput } = useContext(StateContext);
  
  const socket = useSocket();


  return (
    <div className="main-editor">
      <Codingsection socket={socket} user={user} />
      <div className="input-output-container">
        <InputSection />
        <OutputSection data={{ output, setoutput }} />
      </div>
    </div>
  );
};

export default Maineditor;
