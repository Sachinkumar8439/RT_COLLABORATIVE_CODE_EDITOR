import React, { useState, useEffect, useContext, useRef } from "react";
import program from "../Controllers/program";
import burgerimage from "../media/Images/menu-burger.png";
import DropdownMenu from "./Dropdownmenu";
import { StateContext } from "../Context/usecontext";
import Editor from "@monaco-editor/react";
import { monacoFormatLang, monaceThemes, editorOptions } from "../data";
import ProgramForm from "./ProgramForm";
import { useSocket } from "../Context/SocketContetx";
import { handleGenerateCode } from "../Controllers/AI";

const lastfile = JSON.parse(localStorage.getItem("lastfile"));

const match =
  monacoFormatLang.find(
    (val) => val.extension === (lastfile && lastfile.extension)
  ) || null;

export const Codingsection = ({ user ,sethtmlcode,setShowPreview}) => {
  const [token, settoken] = useState(localStorage.getItem("token"));
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleOpenPopup = () => setIsPopupOpen(true);
  const handleClosePopup = () => {
    setIsPopupOpen(false);
  }

  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  // main state variables

  const [theme, settheme] = useState(localStorage.getItem("theme") || "vs-dark");
  const [language, setlanguage] = useState(
    match ? match.name : monacoFormatLang[0].name
  );
  const [prompt ,setprompt] = useState("");
  const [langCode, setLangCode] = useState(match ? match.id : 0);

  const [isChecked, setisChecked] = useState(false);

  const { setoutput, input, setisrunning } = useContext(StateContext);
  const [spin,setspin] = useState(false);

  const [languages, setlanguages] = useState(monacoFormatLang);
  const { currentfile, setcurrentfile, setfiles, files } =
    useContext(StateContext);
  const [content, setcontent] = useState(currentfile ? currentfile.code : "");
  const fileref = useRef(null);
  const htmlref = useRef(null);
   const editorRef = useRef(null);

  

  useEffect(()=>{
    if(currentfile?.extention === "html"){
      sethtmlcode(currentfile.code);
    }
  },[content,currentfile])

  const handleBurgerClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setMenuPosition({
      x: rect.left - 60,
      y: rect.bottom,
    });
    setIsMenuVisible((prev) => !prev);
  };

  const handlewriting = async (value) => {
    if (!currentfile) {
      alert("please select a file first");
      return;
    }
    if (token && currentfile) {
      currentfile.code = value;
      localStorage.setItem("lastfile", JSON.stringify(currentfile));

      setfiles(
        (prev) =>
          prev &&
          prev.map((f) =>
            f._id === currentfile._id ? { ...f, code: value } : f
          )
      );
      if(language === "html") {
        sethtmlcode(value);
      }
      const response = await program.saveProgram(
        "/code-save",
        token,
        currentfile.fileName,
        currentfile.extention,
        value,
        currentfile._id
      );
    }
  };
  const socket = useSocket();
  useEffect(() => {
    socket.on("say-hello", (data) => {
      alert(`${data.name} has joined the room`);
    });

    socket.on("get-text", (data) => {
      if (currentfile && data.programid === currentfile._id) {
        setcontent(data.value);
        handlewriting(data.value);
      }
    });

    return () => {
      socket.off("say-hello");
      socket.off("get-text");
    };
  }, [socket, currentfile]);

  const handleSubmit = async (programname) => {
    if (programname) {
      const ispresent = files.some(pre=>(`${pre.fileName}.${pre.extension}` === programname.trim()));
      if(ispresent){
        return {success:false,message:"Similar File exists. give a Unique Name"}
      }
      const filename = programname.trim().split(".");
      if (filename && filename.length === 2 && token) {
       const isvalidextention =  languages.some(lng=>(lng.extension === filename[1]))
       if(!isvalidextention){
        return{success:false,message:"Extention Not Allowed"}
       }
        setIsPopupOpen(false);
        const response = await program.saveProgram(
          "/code-save",
          token,
          filename[0],
          filename[1],
          "",
          null
        )
       

        if (response.success) {
          setcurrentfile(response.file);

          setfiles((pre) => [response.file, ...pre]);
        }
      }
      else{
        return {success:false,message:"Name Without Extention Not Allowed. Follows [Name].[Extention]"}
      }
      return {success:true};
    }
  };

  const handleselectchange = (e) => {
    if (!currentfile) {
      alert("create or select a file first");
      return;
    }
    const selectedOption = e.target.options[e.target.selectedIndex];
    const selectedLang = monacoFormatLang.find(
      (lang) => lang.name === e.target.value
    );
    setlanguage(selectedOption.text);
    setLangCode(selectedOption.getAttribute("data-lang_code"));

    if (!content || content.trim() === "") {
      setcontent(selectedLang.defaultCode);
      currentfile.code = selectedLang.defaultCode;
      // localStorage.setItem("lastfile", JSON.stringify(currentfile));
    }
  };

  const getaicode = async(e)=>{
    e.preventDefault()
    if(!prompt.trim()) return
    setspin(true)
    const response = await handleGenerateCode(prompt,content)
    if(response?.success){
      const lines = response.code.split("\n");
      setcontent("");
      for (let i = 0; i < lines.length; i++) {
          setTimeout(() => {
            setcontent(pre=>(pre.trim() +  "\n" + lines[i] ))
          }, i*80);
      }
      handlewriting(response.code);
      if(currentfile.extension !== "html") sethtmlcode(response.code);
    }else{
      alert(response.message)
    }
    setspin(false)
    setprompt("")
  }

  const fetchfiles = async () => {
    const result = await program.loadPrograms("/get-files", token);
    if (result.success) {
      if (result.data) {
        setfiles(result.data.Programmes);

        if (!currentfile) return;
        handlewriting(currentfile.code);
        if(currentfile.extension === "html"){
          sethtmlcode(currentfile.code)
        }
      }
    } else {
      if (
        result.message !== "All Files Fetched Successfully" &&
        result.message !== "you are offline"
      ) {
        settoken(null);
        localStorage.clear();
        window.location.href = "/notice";
      }
    }
  };

  useEffect(() => {
    fetchfiles();
    return () => {};
  }, []);
  

  useEffect(() => {
    if (currentfile) {
      const matched = monacoFormatLang.find(
        (val) => val.extension === currentfile.extension
      );
      if(currentfile.extension === "html"){
        sethtmlcode(currentfile.code)
      }

      if (matched) {
        if (currentfile.code.trim() === "") {
          setcontent(matched.defaultCode);
          if(matched.extension === "html"){
            sethtmlcode(matched.defaultCode);
          }
          setcurrentfile({
            ...currentfile,
            code: matched.defaultCode,
          });
          handlewriting(matched.defaultCode);
        } else {
          setcontent(currentfile.code);
        }
        setlanguage(matched.name);
        setLangCode(matched.id);
      }
    }
  }, [currentfile, setcurrentfile]);


  return (
    <div style={{position:"relative"}} className="resizable-container">
          <div style={{background:"black",padding:"10px",left:"0px",gap:"10px",position:"absolute", bottom:"0px",right:"0px",zIndex:"5000"}}>
             <form style={{width:"100%",display:"flex",gap:"10px"}} onSubmit={getaicode}> 

            <input placeholder={"genarate by agent"} style={{backgroundColor:"black",padding:"10px 20px",flex:"1",background:"black",color:"white",borderRadius:"20px"}}  type='text' value={prompt} onChange={(e)=>setprompt(e.target.value)} ></input>
            <button type="submit" style={{width:"40px", height:"40px",borderRadius:"50%",background:"black",color:"white",cursor:"pointer"}}  className={`${spin && "spin"}`}>{spin?"+":"Ai"}</button>
             </form>
          </div>
      <ProgramForm
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        onSubmit={handleSubmit}
      />
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
              if(language === 'html'){
                console.log("running html file");
                setShowPreview(true);
                return
              }
              setShowPreview(false);

              if (!language || content.trim() === "" || !currentfile) {
                alert(
                  "please select file or check your content should not be empty"
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
                setoutput(response.data);
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
                if (!currentfile) {
                  alert("select a file to go live");
                  return;
                }
                setisChecked(e.target.checked);
                if (e.target.checked) {
                  socket.emit("join-room", {
                    name: JSON.parse(localStorage.getItem("user")).Name,
                    programid: currentfile._id,
                  });
                } else {
                  socket.emit("leave-room", currentfile._id);
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
          <li onClick={handleBurgerClick}>
            <img style={{cursor:"pointer"}} src={burgerimage} alt="imag" width="25px" />
          </li>

          <DropdownMenu
            fileref={fileref}
            currentfile={currentfile}
            setcurrentfile={setcurrentfile}
            files={files}
            handleOpenPopup={handleOpenPopup}
            isVisible={isMenuVisible}
            position={menuPosition}
            onClose={() => setIsMenuVisible(false)}
            setcontent={setcontent}
          />
        </ul>
      </div>
      <div
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <Editor
          height={"100%"}
          width={"100%"}
          onChange={(value) => {
            setcontent(value);
            handlewriting(value);
            if (isChecked)
              socket.emit("send-text", { programid: currentfile._id, value });
          }}
          options={editorOptions}
          value={content}
          language={language}
          theme={theme}
          defaultLanguage={language}
        />
      </div>
    </div>
  );
};
