import React, { useState, useEffect, useContext, useRef } from "react";
import program from "../Controllers/program";
import burgerimage from "../media/Images/menu-burger.png";
import DropdownMenu from "./Dropdownmenu";
import { StateContext } from "../Context/usecontext";
import Editor from "@monaco-editor/react";
import { monacoFormatLang, monaceThemes, editorOptions } from "../data";
import ProgramForm from "./ProgramForm";


const lastfile = JSON.parse(localStorage.getItem('lastfile'));

// Compute match only once during the first render
const match = monacoFormatLang.find(
  (val) => val.extension === (lastfile && lastfile.extension)
) || null;

const Codingsection = ({ socket, user }) => {
  const [token, settoken] = useState(localStorage.getItem("token"));
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleOpenPopup = () => setIsPopupOpen(true);
  const handleClosePopup = () => setIsPopupOpen(false);

  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 60, height: 100 });
  const [isResizing, setIsResizing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  // main state variables




// useState hooks that depend on match
const [theme, settheme] = useState(localStorage.getItem("theme") || "vs");
const [language, setlanguage] = useState(match ? match.name : monacoFormatLang[0].name);
const [langCode, setLangCode] = useState(match ? match.id : 0);
const [defaultCode, setdefaultCode] = useState(
  match ? match.defaultCode : monacoFormatLang[0].defaultCode
);

const [isChecked,setisChecked] = useState(false);

  const { setoutput, input, setInput, setisrunning } = useContext(StateContext);
  
  // const [theme, settheme] = useState(localStorage.getItem("theme") || "vs");
  // const [language, setlanguage] = useState(match ? match.name : monacoFormatLang[0].name);
  // const [langCode, setLangCode] = useState(match ? match.id :0);
  // const [defaultCode, setdefaultCode] = useState(
  //   monacoFormatLang[0].defaultCode
  // );

  // console.log("language",language,"langCode", langCode,"default code ",defaultCode)

  const [languages, setlanguages] = useState(monacoFormatLang);
  const [files, setfiles] = useState(null);
  const [currentfile, setcurrentfile] = useState( lastfile || null );
  const [content, setcontent] = useState(lastfile ? lastfile.code : ''
  );

  // console.log('current file ',currentfile , " cuntent ", content)
  const fileref = useRef(null);

  const handleBurgerClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setMenuPosition({
      x: rect.left - 60,
      y: rect.bottom,
    });
    setIsMenuVisible((prev) => !prev);
  };

  const handleMouseDown = (e) => {
    setIsResizing(true);
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isResizing) return;
    const dx = e.clientX - startPos.x;
    setDimensions((prev) => ({
      width: Math.max(10, prev.width + (dx / window.innerWidth) * 100),
    }));

    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  const handlewriting = async (value) => {
    console.log( "token", token, "value", value);
    if (token &&  currentfile) {
      currentfile.code = value;
      localStorage.setItem("lastfile",JSON.stringify(currentfile));

      setfiles((prev) =>
        prev.map((f) => (f._id === currentfile._id ? { ...f, code: value } : f))
    );
    
    
    //  localStorage.setItem('lastfile',JSON.stringify(currentfile));
    const response = await program.saveProgram(
      "/code-save",
      token,
      currentfile.fileName,
      currentfile.extention,
      value,
      currentfile._id,
    );
    socket.emit('send-text',({value , programid:currentfile._id}))
    setcontent(value);
      console.log("Text saving:", response);

      return;
    }
  };

    useEffect(() => {
      // console.log("this is runnung here socket effect ")
      // console.log(currentfile._id)

    
       socket.on('say-hello',(data)=>{
      
        console.log('hello');
  
       })
  
       socket.on('get-text',(data)=>{
        if(data.programid === currentfile._id)
        {
          // setcontent(data.value)
          handlewriting(data.value);
          console.log("bhosda choda")

        }
  
       })
    
        // localStorage.removeItem('token');
        return () => {
          // socket.off('say-hello');
        };
      }, []);

  const handleSubmit = async (programname) => {
    console.log("submit button clicked", programname);
    setIsPopupOpen(false);
    if (programname) {
      const filename = programname.split(".");
      console.log(
        "name ",
        filename[0],
        "extention ",
        filename[1],
        "length ",
        filename.length,
        "token",
        token
      );
      if (filename && filename.length === 2 && token) {
        const response = await program.saveProgram(
          "/code-save",
          token,
          filename[0],
          filename[1],
          "",
          null
        );
        console.log(response);

        if (response.success) {
          console.log("success hai bhai ", response);
          setcurrentfile(response.file);


          
          setfiles((pre) => [response.file, ...pre]);

          
        }
      }
      return;
    }
  };

  // main functions
  const handleselectchange = (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    const selectedLang = monacoFormatLang.find(
      (lang) => lang.name === e.target.value
    );
    setlanguage(selectedOption.text);
    setdefaultCode(selectedOption.getAttribute("data-defaultcode"));
    // localStorage.setItem('language',selectedOption.text)
    setLangCode(selectedOption.getAttribute("data-lang_code"));

    console.log("i am sellecting the languge and content is  ", content)
    if (!content || content.trim() === "") {
      setcontent(selectedLang.defaultCode);
      currentfile.code = selectedLang.defaultCode;
      localStorage.setItem('lastfile',JSON.stringify(currentfile));
    }
    
  };


  const fetchfiles = async () => {
    const result = await program.loadPrograms("/get-files", token);
    console.log("file fecthing result", result,"token:",token);
    if (result.success) {
      console.log("result data ", result.data);
      if (result.data) {
        setfiles(result.data.Programmes);
        handlewriting(currentfile.code);
      }
    }
  };

  useEffect(() => {
    console.log("change in current file",currentfile);
    // socket.emit('join-room',{programid:currentfile._id})
    if (currentfile) {
      const matched = monacoFormatLang.find(val => val.extension === currentfile.extension);

      if (matched) {

        if(currentfile.code.trim() ==='')
          {
            setcontent(matched.defaultCode);
            
          }
          else
          {
            setcontent(currentfile.code);

          }
        setlanguage(matched.name);
        setLangCode(matched.id);
      }
      
      // localStorage.setItem('lastfile',JSON.stringify(currentfile));
    }
  }, [currentfile]);

  useEffect(() => {
    fetchfiles();
    console.log("localstorage", localStorage);
    // setcontent(localStorage.getItem("lastcode"));

    return () => {
    };
  }, []);

  return (
    <div
      className="resizable-container"
      style={{
        width: `${dimensions.width}%`,
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
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
          {/* <img src={burgerimage} alt="Icon" width="20" height="20"> */}

          <li
            style={{
              display: "flex",
              alignItems: "center",
              borderRadius: "4px",
            }}
          >

            <button
            onClick={async (e)=>{
              e.preventDefault();
              const response = await program.getlink('/live-editor',currentfile._id,token)
              console.log(response)
              if(response.success)
              {
                console.log(response);
                navigator.clipboard.writeText(response.link)
                console.log('password',response.password)

              }

            }}

            
            >copy link </button>
{/* <!-- Rounded switch --> */}
<label className="switch">
      <input type="checkbox" checked={isChecked} onChange={(e)=>{
   
   setisChecked(e.target.checked);

   if (e.target.checked) {
    console.log("Switch is ON ✅");
    socket.emit('join-room',(currentfile._id));
    // do something when ON
  }
  else{
    console.log("switch off ");
    socket.emit("leave-room", currentfile._id);
  }
      }} />
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
          </li>
          <li style={{ alignSelf: "flex-end" }} onClick={handleBurgerClick}>
            <img src={burgerimage} alt="imag" width="25px" />
          </li>
          <DropdownMenu
            fileref={fileref}
            currentfile={currentfile}
            setcurrentfile={setcurrentfile}
            files={files}
            handleOpenPopup={handleOpenPopup}
            isVisible={isMenuVisible}
            position={menuPosition}
            language={language}
            onClose={() => setIsMenuVisible(false)}
            setcontent={setcontent}
          />
        </ul>
      </div>
      <div className="content content-area textarea">
        <Editor
          style={{
            flex: "1",
          }}
          // value={content}
          onChange={(value) => {
            // setcontent(value);
            handlewriting(value);
            socket.emit("send-updated-code", { value });
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
            alert("please select language or check your content not be empty");
            return;
          }
          setisrunning(true);
          console.log("lancode",langCode,"content",content)
          // setInput(inputSimp)
          const response = await program.getoutput(
            "/output",
            content,
            langCode,
            input
          );
          if (response.success) {
            console.log("output Response:", response.data);
            setoutput(response.data);
            setisrunning(false);
            return;
          }
          setisrunning(false);
        }}
      >
        run code
      </button>
      <div className="resizer" onMouseDown={handleMouseDown}></div>
    </div>
  );
};

export default Codingsection;
