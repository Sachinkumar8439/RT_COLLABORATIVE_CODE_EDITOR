import React, { useContext } from "react";
import { StateContext } from "../Context/usecontext";
import Terminal from "./Terminal";

const Outputsection = ({ data }) => {
  const { isrunning ,setisrunning} = useContext(StateContext);
  return (
    <div className="outputsection-container">
      <div style={{overflowY:'auto'}} className="output-content content-area">
        <Terminal data={data} isrunning={isrunning} setisrunning={setisrunning}/>
      </div>
    </div>
  );
};


export default Outputsection;
