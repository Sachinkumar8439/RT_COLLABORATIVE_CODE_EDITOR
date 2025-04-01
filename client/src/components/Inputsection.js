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
    // alert("innerText:",e.target.value)
    setInput(e.target.innerText);
    // if (!divRef.current) return; // Ensure ref exists

    // const selection = window.getSelection();
    // if (!selection.rangeCount) return; // Ensure selection exists

    // const range = selection.getRangeAt(0);

    // // Save cursor position
    // const cursorPosition = range.startOffset;

    // // Ensure div has text content
    // if (divRef.current.childNodes.length === 0) {
    //   divRef.current.appendChild(document.createTextNode(""));
    // }

    // // Restore cursor position safely
    // const textNode = divRef.current.childNodes[0];
    // const newRange = document.createRange();
    // newRange.setStart(textNode, Math.min(cursorPosition, textNode.length));
    // newRange.setEnd(textNode, Math.min(cursorPosition, textNode.length));

    // selection.removeAllRanges();
    // selection.addRange(newRange);
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
          {input}
        </p>
      </div>
      <div className="resizer-b" onMouseDown={handleMouseDown}></div>
    </div>
  );
};

export default Inputsection;
