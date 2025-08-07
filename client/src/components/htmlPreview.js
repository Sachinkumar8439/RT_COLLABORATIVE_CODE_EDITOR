import React, { useState, useEffect } from "react";
import "../Styles/htmlpreview.css";

const HtmlPreview = ({ content, visible, onClose }) => {
  // const [srcDoc, setSrcDoc] = useState("");
   
  // useEffect(() => {
  //   // if (visible) setSrcDoc(content);
  // }, [content, visible]);

  if (!visible) return null;

  return (
      <div  className="html-preview-container">
        {/* Header */}
        <div className="html-preview-header">
          <h2>HTML Preview</h2>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>

        {/* Preview */}
        <iframe
          title="HTML Preview"
          srcDoc={content}
          sandbox="allow-scripts"
          className="html-preview-iframe"
        ></iframe>
      </div>
  );
};

export default HtmlPreview;
