import React, { useContext, useEffect, useState } from "react";
import { StateContext } from "../Context/usecontext";
import { Codingsection} from "./Codingsection";
import InputSection from "./Inputsection";
import OutputSection from "./Outputsection";
import "../Styles/Maineditor.css";
import { useSocket } from "../Context/SocketContetx";
import { useLocation } from "react-router-dom";
import HtmlPreview from "./htmlPreview";

const Maineditor = () => {
  const location = useLocation();
  const [htmlcode,sethtmlcode] = useState("")
  const [showPreview, setShowPreview] = useState(false);
  const [user, setuser] = useState(location.state);
  const { output, setoutput } = useContext(StateContext);
  
  const socket = useSocket();


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
