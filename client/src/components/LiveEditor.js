import React, { useState,forwardRef,useRef, useEffect, useContext } from "react";
import Draggable from "react-draggable";
import program from "../Controllers/program";
import Editor from "@monaco-editor/react";
import Navbar from "./Navbar"
import { Resizable } from "react-resizable";
import "react-resizable/css/styles.css";
import { monacoFormatLang, monaceThemes, editorOptions } from "../data";
import { useParams } from "react-router-dom";
import "../Styles/AuthForm.css"


const InputBox = ({heading,value}) => {
  const handleInput = (e) => {
    console.log(e.target.textContent);
  };

  const nodeRef = useRef(null);
  const [size, setSize] = useState({ width: 400, height: 400 });

  // Handle Resize
  const onResize = (e, { size }) => {
    setSize(size);
  };

  return (
    <Draggable  nodeRef={nodeRef} cancel=".react-resizable-handle">
      {/* <Resizable width={size.width} height={size.height} onResize={onResize}> */}
        <div
          ref={nodeRef}
          style={{
            width: size.width,
          height: size.height,
          background: "black",
          position: "absolute",
          borderRadius: "5px",
          top: heading === "Input Box" ? "100px" : "50px",
          left: "50%",
          zIndex: 500000,
          border: "1px solid grey",
          color: "white",
          display: "flex",
          flexDirection: "column",
          // alignItems: "flex-start",
          }}
        >
          <p style={{background:'white',color:'black',padding:'2px 5px',}}>{heading}</p>
          <p 
           {...(heading === "Input Box"
            ? {
                contentEditable: true,
                suppressContentEditableWarning: true,
                onInput: handleInput,
              }
            : {})}
          style={{fontSize:"15px",wordWrap:"break-word",padding:'1px 2px'}} className="input-field">{value}</p>

       <Resizable
          width={size.width}
          height={size.height}
          onResize={onResize}
          resizeHandles={["se"]} // Only bottom-right resizing
        >
          <div style={{ width: "100%", height: "100%" }} />
        </Resizable>
        </div>
    </Draggable>
  );
};




const Authbox = ({userid,programid,setisable}) => {
  const [error,seterror] = useState('');
  const [data, setdata] = useState({
    userName:"",
    Code:"",
    userId:userid,
    programId:programid,
    });


  const handlesubmit = async (e)=>{
    e.preventDefault();
    console.log(data);
    setisable(true);



  }
  return (
    <div style={{width:'100%',background:'grey'
    }} className="auth-container">
      <Navbar/>
    <div style={{borderRadius:'0px',}}  className="form-container">
      <h2 className="form-title">Validate First</h2>
      <p className="form-description">
        Enter Enter correct code</p>
      <form onSubmit={handlesubmit}  className="form">
            <input
              type="text"
              placeholder="Enter username"
              required
              className="input"
              onChange={(e) =>
                setdata({ ...data, userName:e.target.value})}
            />
            
            <input
              type="password"
              placeholder="Enter code "
              required
              className="input" 
              onChange={(e) =>
                setdata({ ...data, Code:e.target.value})}
              />

        <p className="error">{error}</p>
        <button type="submit" className="submit-btn">Continue
        </button>
      </form>
      <p className="switch-text">
        <button className="switch-btn" onClick={() =>console.log('')} >go to login</button>
      </p>
    </div>
  </div>
  );
};

const LiveEditor = () => {
  const [isable , setisable]= useState(false)
  const { userid, programid } = useParams();

    const [isrunning,setisrunning] = useState(false)
    const [input,setinput] = useState('');
    const [isviewinput,setisviewinput] = useState(false);
    const [isviewoutput,setisviewoutput] = useState(false);
      const [ output , setoutput  ]= useState('output will be shown here');
      const [theme, settheme] = useState(localStorage.getItem("theme") || "vs");
      const [language, setlanguage] = useState();
      const [defaultCode, setdefaultCode] = useState(
        monacoFormatLang[0].defaultCode
      );
    
      const [languages, setlanguages] = useState(monacoFormatLang);
      const [content, setcontent] = useState("");
      const [langCode,setLangCode] = useState(0);


        const handleselectchange = (e) => {
          const selectedOption = e.target.options[e.target.selectedIndex];
          if (selectedOption.text === language) return;
          const selectedLang = monacoFormatLang.find(lang => lang.name === e.target.value);
          setcontent(selectedLang.defaultCode);
          setlanguage(selectedOption.text);
          setdefaultCode(selectedOption.getAttribute("data-defaultcode"));
          setLangCode(selectedOption.getAttribute("data-lang_code"));
          // if(content === ""){
            // }
        };
  return (
    <div style={{ width: "100%", height: "100%",display:"flex" }}>

      {!isable ? <Authbox userid={userid} programid = {programid} setisable={setisable} /> :
      <>
      <div style={{flex:'1'}}
        className="resizable-container">
        <div className="inner-navbar">
          <span>
            <strong style={{ fontSize: "30px" }}>RT</strong>
            <strong style={{ color: "tomato" }}>code_EDITOR</strong>
          </span>
          <ul className="inner-nav-list">
            {/* <img src={burgerimage} alt="Icon" width="20" height="20"> */}

            <li
              style={{
                display: "flex",
                alignItems: "center",
                borderRadius: "4px",
                // background:"grey",
                width:'320px',
                justifyContent:"space-between"
              }}
            >
              <select
                id="coding-languages"
                value={language}
                onChange={handleselectchange}
              >
                {languages.map((val, index) => (
                  <option
                  key={index}
                  value={val.name}
                  data-defaultcode={val.defaultCode}
                  data-lang_code={val.id}
                  >
                    {val.name}
                  </option>
                ))}
              </select>
              <select
                id="coding-languages"
                value={theme}
                onChange={(e) => {
                  const selectedTheme = e.target.value;
                  localStorage.setItem("theme", selectedTheme);
                  settheme(selectedTheme);
                }}
              >
                {monaceThemes.map((val, index) => (
                  <option key={index} value={val.name}>
                    {val.name}
                  </option>
                ))}
              </select>
              <div style={{display:'flex',width:'65px',justifyContent:'space-between'}}>
                <button title="input terminal" style={{padding:'3px',borderRadius:'5px',cursor:'pointer'}} onClick={()=>setisviewinput(!isviewinput)}>&gt;_i</button>
                <button title="output terminal" style={{padding:'3px',borderRadius:'5px',cursor:'pointer'}} onClick={()=>setisviewoutput(!isviewoutput)}>&lt;_o</button>
              </div>
            </li>
            {/* <li style={{ alignSelf: "flex-end" }} onClick={handleBurgerClick}>
              <img src={burgerimage} alt="imag" width="25px" />
            </li>
            <DropdownMenu
              isVisible={isMenuVisible}
              position={menuPosition}
              language={language}
              onClose={() => setIsMenuVisible(false)}
            /> */}
          </ul>
        </div>
          {isviewinput && <InputBox heading={'Input Box'} value={'give input here'} />}
          {isviewoutput && <InputBox heading={'Output Box'} value={output} />}
        <div style={{       
            width:"100%",
            height:"100%",
            // height: "400px",
            border: "1px solid black",}} >
          <Editor
            // style={{
            //   flex: "1",
            // }}
            // value={content}
            height="100%"
            width="100%"
            onChange={(value) => {
              setcontent(value);
            }}
            options={editorOptions}
            value={content}
            language={language}
            theme={theme}
            defaultLanguage={language}
          />
        </div>
        <button
          className="run-button"
          onClick={async (e) => {
            e.preventDefault();
            if (!language || !content) {
              alert(
                "please select language or check your content not be empty"
              );
              return;
            }
            setisrunning(true);
            const response = await program.getoutput(
              "/output",
              content,
              langCode,
              input
            );
            // if (response.success) {
            console.log("output Response:", response.data);
            setoutput(response.data.output);
            setisrunning(false);

            // }
          }}
        >
          run code
        </button>
      </div>
      </>
      }
    </div>
  );
};

export default LiveEditor;
