import React, { useState, useEffect } from "react";
import program from "../Controllers/program";
import burgerimage from "../media/Images/menu-burger.png";
import DropdownMenu from "./Dropdownmenu";
import Editor from "@monaco-editor/react";
import { monacoFormatLang, monaceThemes, editorOptions } from "../data";

const Codingsection = ({ socket }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 60, height: 100 });
  const [isResizing, setIsResizing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  // main state variables

  const [theme, settheme] = useState(localStorage.getItem("theme") || "vs");
  const [language, setlanguage] = useState();
  const [defaultCode, setdefaultCode] = useState(
    monacoFormatLang[0].defaultCode
  );
  const [languages, setlanguages] = useState(monacoFormatLang);
  const [content, setcontent] = useState(null);

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

  // main functions
  const handleselectchange = (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    if (selectedOption.text === language) return;
    setlanguage(selectedOption.text);
    setdefaultCode(selectedOption.getAttribute("data-defaultcode"));
    if(content !== null && content.length ===0)
    {
      setcontent(selectedOption.getAttribute("data-defaultcode"));
    }
  };

  useEffect(() => {
    socket.on("get-updated-code", (data) => {
      console.log("this get updated code works", data.value);

      setcontent(`${data.value}`);
    });

    return () => {
      socket.off("get-updated-code");
    };
  }, [socket]);

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
      <div className="inner-navbar">
        <span>
          <strong style={{ fontSize: "30px" }}>RC</strong>
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
            isVisible={isMenuVisible}
            position={menuPosition}
            language={language}
            onClose={() => setIsMenuVisible(false)}
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
            setcontent(value);
            socket.emit("send-updated-code", { value });
          }}
          options={editorOptions}
          value={typeof content === "string" && content.length >=0 ? content : defaultCode}
          language={language}
          theme={theme}
          defaultLanguage={language}
        />
      </div>
      <button
        className="run-button"
        onClick={(e) => {
          e.preventDefault();
          if (!language || !content) {
            alert("please select language or check your content not be empty");
            return;
          }
          const response = program.getoutput("/output", content, language);
          if (response.success) {
            console.log(response.data);
          }
        }}
      >
        run code
      </button>
      <div className="resizer" onMouseDown={handleMouseDown}></div>
    </div>
  );
};

export default Codingsection;
