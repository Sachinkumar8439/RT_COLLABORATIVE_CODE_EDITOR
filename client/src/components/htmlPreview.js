import React, { useState, useEffect, useReducer, useRef, useContext } from "react";
import { FaExpand, FaCompress } from "react-icons/fa";

import "../Styles/htmlpreview.css";
import { StateContext } from "../Context/usecontext";

const HtmlPreview = ({ content, visible, onClose }) => {
  const { currentfile, setcurrentfile, setfiles, files } =
  useContext(StateContext);
  const goFullScreen = () => {
  const iframe = document.getElementById("iframe");
  if (iframe.requestFullscreen) {
    iframe.requestFullscreen();
  } else if (iframe.webkitRequestFullscreen) {
    iframe.webkitRequestFullscreen(); 
  } else if (iframe.msRequestFullscreen) {
    iframe.msRequestFullscreen(); 
  }
};
  
  useEffect(()=>{
    if(currentfile && files && visible===true){
      const iframe = document.getElementById("iframe");
          iframe.addEventListener("load", () => {
  const scripts = iframe.contentDocument.querySelectorAll("script");
  if (scripts.length > 0) {
    for (const element of scripts) {
      const match =  files.find(f=>(`${f.fileName}.${f.extension}` === element.id))
      if(match){
        element.textContent = match.code;
      }
      else{
        if(element.id)
        console.error("script id for the",element.id,"not found");
      }

    }

  }
});
         
  }

      },[currentfile,content,files,visible])
 
  if (!visible) return null;

  return (
      <div  className="html-preview-container">
        {/* Header */}
        <div className="html-preview-header">
          <h2>HTML Preview</h2>
          <button onClick={goFullScreen} className="close-btn"><FaExpand/></button>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>

        {/* Preview */}
        <iframe
          title="HTML Preview"
          srcDoc={content}
          sandbox="allow-scripts allow-same-origin allow-modals allow-forms"
          className="html-preview-iframe"
          id="iframe"
          allowFullScreen
        ></iframe>
      </div>
  );
};

export default HtmlPreview;
