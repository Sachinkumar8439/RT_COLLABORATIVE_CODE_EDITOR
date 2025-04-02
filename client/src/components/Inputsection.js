import React, { useState, useEffect, useContext, useRef } from "react";
import { StateContext } from "../Context/usecontext";

const Inputsection = () => {
  const [dimensions, setDimensions] = useState({ width: 60, height: 50 });
  const [isResizing, setIsResizing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const {input,setInput} = useContext(StateContext);
  const divRef = useRef(null);

  const handleMouseDown = (e) => {
    setIsResizing(true);
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const inputSetter = (e) =>{
    setInput(e.target.innerText);
  }





//   const put = () =>{
//     alert(input);
//   }

//  useEffect (() =>{
//   put();
//  },[input]);


  const handleMouseMove = (e) => {
    if (!isResizing) return;
    const dy = e.clientY - startPos.y;

    setDimensions((prev) => ({
      height: Math.max(10, prev.height + (dy / window.innerHeight) * 100),
    }));

    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  return (
    <div
      className="inputsection-container"
      style={{
        height: `${dimensions.height}%`,
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="input-content content-area">
        <p style={{padding:"3px"}} contentEditable="true" 
          data-input={input}
          onInput={inputSetter}
        >
         
        </p>
      </div>
      <div className="resizer-b" onMouseDown={handleMouseDown}></div>
    </div>
  );
};

export default Inputsection;
