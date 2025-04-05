import React, {
  useState,
  forwardRef,
  useRef,
  useEffect,
  useContext,
} from "react";
import Draggable from "react-draggable";
import program from "../Controllers/program";
import Editor from "@monaco-editor/react";
import Navbar from "./Navbar";
import { Resizable } from "react-resizable";
import "react-resizable/css/styles.css";
import { monacoFormatLang, monaceThemes, editorOptions } from "../data";
import { useParams } from "react-router-dom";
import "../Styles/AuthForm.css";
import NotificationBox from "./Notice";

const InputBox = ({ heading, value }) => {
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
    <Draggable nodeRef={nodeRef} cancel=".react-resizable-handle">
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
        <p style={{ background: "white", color: "black", padding: "2px 5px" }}>
          {heading}
        </p>
        <p
          {...(heading === "Input Box"
            ? {
                contentEditable: true,
                suppressContentEditableWarning: true,
                onInput: handleInput,
              }
            : {})}
          style={{
            fontSize: "15px",
            wordWrap: "break-word",
            padding: "1px 2px",
          }}
          className="input-field"
        >
          {value}
        </p>

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

const Authbox = ({ userid, programid, setisValid, setcontent }) => {
  const [error, seterror] = useState("");
  const [data, setdata] = useState({
    userName: "",
    Code: "",
    // userId: userid,
    programId: programid,
  });

  const handlesubmit = async (e) => {
    e.preventDefault();
    console.log(data);
    const response = await program.verifymemeber(
      "/member-validate",
      data.programId,
      data.Code,
      data.userName
    );
    console.log(response);
    if (response.success) {
      setisValid(true);
      setcontent(response.data.code);
      const existingData = JSON.parse(sessionStorage.getItem(programid)) || {};
      existingData.isValid = true;
      existingData.content = response.data.code;
      sessionStorage.setItem(programid, JSON.stringify(existingData));
      console.log("localstorage",localStorage)
      return;
    }
    seterror(response.message);
  };
  return (
    <div
      style={{ width: "100%", background: "grey" }}
      className="auth-container"
    >
      <Navbar />
      <div style={{ borderRadius: "0px" }} className="form-container">
        <h2 className="form-title">Validate First</h2>
        <p className="form-description">Enter Enter correct code</p>
        <form onSubmit={handlesubmit} className="form">
          <input
            type="text"
            placeholder="Enter username"
            required
            className="input"
            onChange={(e) => setdata({ ...data, userName: e.target.value })}
          />

          <input
            type="password"
            placeholder="Enter code "
            required
            className="input"
            onChange={(e) => setdata({ ...data, Code: e.target.value })}
          />

          <p className="error">{error}</p>
          <button type="submit" className="submit-btn">
            Continue
          </button>
        </form>
        <p className="switch-text">
          <button className="switch-btn" onClick={() => console.log("")}>
            go to login
          </button>
        </p>
      </div>
    </div>
  );
};

const LiveEditor = () => {
  const { userid, programid } = useParams();
  const [extime,setextime] = useState(null)
  const savedData = sessionStorage.getItem(programid);
  const parsedData = savedData ? JSON.parse(savedData) : {};
  const [errormessage ,seterrormessage] = useState({heading:'INVALID LINK',para:'Provide a VALID LINK PLEASE',btntext:'Go To Login'})

  const [content, setcontent] = useState(parsedData.content ?? "");

  const [isable, setisable] = useState(parsedData.isable ?? false);
  const [isValid, setisValid] = useState(parsedData.isValid ?? false);

  const [isrunning, setisrunning] = useState(false);
  const [input, setinput] = useState("");
  const [isviewinput, setisviewinput] = useState(false);
  const [isviewoutput, setisviewoutput] = useState(false);
  const [output, setoutput] = useState("output will be shown here");
  const [theme, settheme] = useState(localStorage.getItem("theme") || "vs");
  const [language, setlanguage] = useState();
  const [defaultCode, setdefaultCode] = useState(
    monacoFormatLang[0].defaultCode
  );

  const [languages, setlanguages] = useState(monacoFormatLang);
  // const [content, setcontent] = useState(
  //   localStorage.getItem(programid)
  //     ? JSON.parse(localStorage.getItem(programid)).content
  //     : ""
  // );
  const [langCode, setLangCode] = useState(0);
  // const date = new Date(expiresat);
  // const milliseconds = date.getTime();
  // console.log(milliseconds, ":", Date.now());

  const handleselectchange = (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    if (selectedOption.text === language) return;
    const selectedLang = monacoFormatLang.find(
      (lang) => lang.name === e.target.value
    );
    setcontent(selectedLang.defaultCode);
    setlanguage(selectedOption.text);
    setdefaultCode(selectedOption.getAttribute("data-defaultcode"));
    setLangCode(selectedOption.getAttribute("data-lang_code"));
    // if(content === ""){
    // }
  };

  console.log("pint 1");
  const ckecklink = async () => {
    console.log("pint 4");

    const response = await program.checklink(
      "/link-validation",
      programid,
      userid
    );
    console.log(response);
    if (response.success) {
      console.log("point 7");
      if(!response.expired)
      {
        setextime(response.time)
  
        setisable(true);
        const existingData = JSON.parse(sessionStorage.getItem(programid)) || {};
        existingData.isable = true;
        sessionStorage.setItem(programid, JSON.stringify(existingData));
        return;

      }

      setisable(false);


    }
    setisable(false);

    // localStorage.removeItem(programid);
  };

  useEffect(() => {
    console.log("pint 2");

    // localStorage.removeItem(programid)
    console.log("localstorage", sessionStorage);
    console.log("pint 3");

    ckecklink();
  }, []);

  useEffect(() => {
    if (content) {
      const existingData = sessionStorage.getItem(programid);
      if (existingData) {
        const validationdata = JSON.parse(existingData);
        validationdata.content = content;
        sessionStorage.setItem(programid, JSON.stringify(validationdata));
      }
    }
  }, [content]);


  useEffect(()=>{

    
     
  },[extime])

  console.log("pint 5");

  // if(!isable) return ;

  console.log("pint 6");

  return (
    <>
      {!isable && !isValid ? (
        <NotificationBox
          heading={errormessage.heading}
          para={errormessage.para}
          btntext={errormessage.btntext}
        />
      ) : (
        ""
      )}
      <div style={{ width: "100%", height: "100%", display: "flex" }}>
        {isable && !isValid ? (
          <Authbox
            userid={userid}
            programid={programid}
            setisValid={setisValid}
            setcontent={setcontent}
          />
        ) : (
          <>
            <div style={{ flex: "1" }} className="resizable-container">
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
                      width: "320px",
                      justifyContent: "space-between",
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
                    <div
                      style={{
                        display: "flex",
                        width: "65px",
                        justifyContent: "space-between",
                      }}
                    >
                      <button
                        title="input terminal"
                        style={{
                          padding: "3px",
                          borderRadius: "5px",
                          cursor: "pointer",
                        }}
                        onClick={() => setisviewinput(!isviewinput)}
                      >
                        &gt;_i
                      </button>
                      <button
                        title="output terminal"
                        style={{
                          padding: "3px",
                          borderRadius: "5px",
                          cursor: "pointer",
                        }}
                        onClick={() => setisviewoutput(!isviewoutput)}
                      >
                        &lt;_o
                      </button>
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
              {isviewinput && (
                <InputBox heading={"Input Box"} value={"give input here"} />
              )}
              {isviewoutput && (
                <InputBox heading={"Output Box"} value={output} />
              )}
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  // height: "400px",
                  border: "1px solid black",
                }}
              >
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
        )}
      </div>
    </>
  );
};

export default LiveEditor;
