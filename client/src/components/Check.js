import React, { useState, useRef } from "react";
import Editor from "@monaco-editor/react";

export default function Check() {
    const [width, setWidth] = useState(800); // Initial width of the parent container
    const editorRef = useRef(null);
  
    return (
      <div style={{width:"100%",height:'100vh',background:"black"}}>
        <button onClick={() => setWidth(width + 50)}>Increase Width</button>
        <button onClick={() => setWidth(width - 50)}>Decrease Width</button>
  
        <div
          ref={editorRef}
          style={{
            // width: `${width}px`,
            width:"100%",
            height:"100%",
            // height: "400px",
            border: "1px solid black",
          }}
        >
          <Editor
            height="100%"
            width="100%"
            defaultLanguage="javascript"
            defaultValue="// Type your code here..."
            theme="vs-dark"
          />
        </div>
      </div>
    );
  };
