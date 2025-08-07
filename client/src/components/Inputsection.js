import React, { useState, useContext } from "react";
import { StateContext } from "../Context/usecontext";

const Inputsection = () => {
  const [dimensions, setDimensions] = useState({ width: 60, height: 50 });
  const [isResizing, setIsResizing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const { input, setInput } = useContext(StateContext);

  const handleMouseDown = (e) => {
    setIsResizing(true);
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const inputSetter = (e) => {
    setInput(e.target.innerText);
  };

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
      <div style={{overflowY:"auto"}} className="input-content content-area">
        <p
          style={{ 
            
           padding: "0px 3px",
    height: "100%",
    wordBreak: "break-word",     // <-- Ensures long words break
    overflowWrap: "break-word",  // <-- Legacy support, still useful
    whiteSpace: "pre-wrap",      // <-- Preserves line breaks and wraps text
    fontFamily: "monospace",
          }}
          contentEditable="true"
          data-input={input}
          onInput={inputSetter}
        ></p>
      </div>
      <div className="resizer-b" onMouseDown={handleMouseDown}></div>
    </div>
  );
};

export default Inputsection;
