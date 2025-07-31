import React, { useState, useRef, useEffect } from "react";
import { PulseLoader } from "react-spinners";

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
import { useSocket } from "../Context/SocketContetx";

const InputBox = ({ heading, value, setinput ,isrunning }) => {
  const handleInput = (e) => {
    e.preventDefault();
    setinput(e.target.textContent);
  };

  const nodeRef = useRef(null);
  const [size, setSize] = useState({ width: 400, height: 400 });

  const onResize = (e, { size }) => {
    setSize(size);
  };

  return (
    <Draggable nodeRef={nodeRef} cancel=".react-resizable-handle">
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
          overflow:"auto",
          flexDirection: "column",
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
            whiteSpace: "pre-wrap",
            fontFamily: "monospace",
            padding: "1px 2px",
          }}
          className="input-field"
        >
          {value}
          {heading === "Input Box" ? (
            ""
          ) : ( isrunning &&
            <> 
              <div style={styles.loaderContainer}>
                <PulseLoader color="white" size={10} />
              </div>
            </>
          )}
        </p>

        <Resizable
          width={size.width}
          height={size.height}
          onResize={onResize}
          resizeHandles={["se"]} 
        >
          <div style={{ width: "100%", height: "100%" }} />
        </Resizable>
      </div>
    </Draggable>
  );
};

const Authbox = ({ setname, programid, setisValid, setcontent ,setlanguage,setLangCode}) => {
  const [error, seterror] = useState("");
  const [data, setdata] = useState({
    userName: "",
    Code: "",
    programId: programid,
  });

  const handlesubmit = async (e) => {
    e.preventDefault();
    const response = await program.verifymemeber(
      "/member-validate",
      data.programId,
      data.Code,
      data.userName
    );
    if (response.success) {
      setcontent(response.data.code);
      const lang = monacoFormatLang.find(val=>(val.extension === response.data.extension));
      if(!lang) alert("the extention of this file not allowed")
      setlanguage(lang.name)
      const existingData = JSON.parse(sessionStorage.getItem(programid)) || {};
      existingData.isValid = true;
      existingData.content = response.data.code;
      existingData.name = data.userName;
      existingData.language = lang;
      setLangCode(lang.id)
      sessionStorage.setItem(programid, JSON.stringify(existingData));
      setname(data.userName);
      setisValid(true);
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
  const [extime, setextime] = useState(null);
  const savedData = sessionStorage.getItem(programid);
  const parsedData = savedData ? JSON.parse(savedData) : {};
  const [name, setname] = useState(parsedData.name || "");
  const [errormessage, seterrormessage] = useState({
    heading: "Validating ",
    para: "checking of your link",
    btntext: "loading...",
  });

  const [content, setcontent] = useState(parsedData.content ?? "");

  const [isable, setisable] = useState(parsedData.isable ?? false);
  const [isValid, setisValid] = useState(parsedData.isValid ?? false);
  const [isChecked, setisChecked] = useState(false);

  const [isrunning, setisrunning] = useState(false);
  const [input, setinput] = useState("");
  const [isviewinput, setisviewinput] = useState(false);
  const [isviewoutput, setisviewoutput] = useState(false);
  const [output, setoutput] = useState("output will be shown here");
  const [theme, settheme] = useState(localStorage.getItem("theme") || "vs");
  const [language, setlanguage] = useState(parsedData.language?.name || "");

  const [languages, setlanguages] = useState(monacoFormatLang);

  const [langCode, setLangCode] = useState(parsedData.language?.id || 0);


  const handleselectchange = (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    if (selectedOption.text === language) return;
    setlanguage(selectedOption.text);
    setLangCode(selectedOption.getAttribute("data-lang_code"));
  };

  const socket = useSocket();
  useEffect(() => {
    socket.on("say-hello", (data) => {
      alert(`${data.name} has joined the room`);
    });

    socket.on("get-text", (data) => {
      setcontent(data.value);

    });

    return () => {
      socket.off("get-text");
      socket.off("say-hello");
    };
  }, [socket]);

  const ckecklink = async () => {

    const response = await program.checklink(
      "/link-validation",
      programid,
      userid
    );
    if (response.success) {
      if (!response.expired) {
        setextime(response.time);

        setisable(true);
        const existingData =
          JSON.parse(sessionStorage.getItem(programid)) || {};
        existingData.isable = true;
        sessionStorage.setItem(programid, JSON.stringify(existingData));
        return;
      }

      seterrormessage({
        heading: "LINK EXPIRED",
        para: "This link duration is crossed its time limit .. create a new one",
        btntext: "go to login",
      });

      setisable(false);
      return;
    }
    seterrormessage({
      heading: "LINK IS INVALID",
      para: "Please Enter a valid link ",
      btntext: "go to login",
    });

    setisable(false);

  };

  useEffect(() => {
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

  useEffect(() => {
    if (extime) {
      const currenttime = Date.now();
      setTimeout(() => {
        setisValid(false);
        setisable(false);
        sessionStorage.removeItem(programid);
        seterrormessage({
          heading: "TIME UP",
          para: "your time limit ended make new if required",
          btntext: "Go to login",
        });
      }, extime - currenttime);
    }
  }, [extime,programid]);

  return (
    <>
      {isable ? (
        isValid ? (
          <div style={{ width: "100%", height: "100%", display: "flex" }}>
            <div style={{ flex: "1" }} className="resizable-container">
              <div className="inner-navbar">
                <span>
                  <strong style={{ fontSize: "30px" }}>RT</strong>
                  <strong style={{ color: "tomato" }}>code_EDITOR</strong>
                </span>
                <ul className="inner-nav-list">
                  <button
                    className="run-button"
                    onClick={async (e) => {
                      e.preventDefault();
                      setisviewoutput(true);
                      setoutput('');
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
                      if (response.success) {
                        const string = `${response.data.compile_output || ""}${
                          response.data.stdout || ""
                        }`;
                        setoutput(string);
                        setisrunning(false);
                        return;
                      }
                      setisrunning(false);
                    }}
                  >
                    run
                  </button>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        setisChecked(e.target.checked);

                        if (e.target.checked) {
                          socket.emit("join-room", { programid, name });
                        } else {
                          socket.emit("leave-room", programid);
                        }
                      }}
                    />
                    <span className="slider round"></span>
                  </label>
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
                    id="coding-themes"
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
                </ul>
              </div>
              {isviewinput && (
                <InputBox
                  heading={"Input Box"}
                  value={""}
                  setinput={setinput}
                />
              )}
              {isviewoutput && (
                <InputBox heading={"Output Box"} value={output} isrunning={isrunning} />
              )}
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  border: "1px solid black",
                }}
              >
                <Editor
                  height="100%"
                  width="100%"
                  onChange={(value) => {
                    setcontent(value);
                    socket.emit("send-text", { value, programid });
                  }}
                  options={editorOptions}
                  value={content}
                  language={language}
                  theme={theme}
                  defaultLanguage={language}
                />
              </div>
            </div>
          </div>
        ) : (
          <Authbox
          setLangCode={setLangCode}
          setlanguage={setlanguage}
            programid={programid}
            setisValid={setisValid}
            setcontent={setcontent}
            setname={setname}
          />
        )
      ) : (
        <NotificationBox
          heading={errormessage.heading}
          para={errormessage.para}
          btntext={errormessage.btntext}
        />
      )}
    </>
  );
};
const styles = {
  loaderContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
};

export default LiveEditor;
