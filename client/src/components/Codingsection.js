import React, { useState, useEffect, useContext, useRef } from "react";
import program from "../Controllers/program";
import burgerimage from "../media/Images/menu-burger.png";
import DropdownMenu from "./Dropdownmenu";
import { StateContext } from "../Context/usecontext";
import Editor from "@monaco-editor/react";
import { monacoFormatLang, monaceThemes, editorOptions } from "../data";
import ProgramForm from "./ProgramForm";
import { useSocket } from "../Context/SocketContetx";

const lastfile = JSON.parse(localStorage.getItem("lastfile"));

const match =
  monacoFormatLang.find(
    (val) => val.extension === (lastfile && lastfile.extension)
  ) || null;

export const Codingsection = ({ user }) => {
  const [token, settoken] = useState(localStorage.getItem("token"));
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleOpenPopup = () => setIsPopupOpen(true);
  const handleClosePopup = () => setIsPopupOpen(false);

  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  // main state variables

  const [theme, settheme] = useState(localStorage.getItem("theme") || "vs");
  const [language, setlanguage] = useState(
    match ? match.name : monacoFormatLang[0].name
  );
  const [langCode, setLangCode] = useState(match ? match.id : 0);

  const [isChecked, setisChecked] = useState(false);

  const { setoutput, input, setisrunning } = useContext(StateContext);

  const [languages, setlanguages] = useState(monacoFormatLang);
  const { currentfile, setcurrentfile, setfiles, files } =
    useContext(StateContext);
  const [content, setcontent] = useState(currentfile ? currentfile.code : "");
  const fileref = useRef(null);

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
    setIsPopupOpen(false);
    if (programname) {
      const filename = programname.split(".");
      if (filename && filename.length === 2 && token) {
        const response = await program.saveProgram(
          "/code-save",
          token,
          filename[0],
          filename[1],
          "",
          null
        );

        if (response.success) {
          setcurrentfile(response.file);

          setfiles((pre) => [response.file, ...pre]);
        }
      }
      return;
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
      localStorage.setItem("lastfile", JSON.stringify(currentfile));
    }
  };

  const fetchfiles = async () => {
    const result = await program.loadPrograms("/get-files", token);
    if (result.success) {
      if (result.data) {
        setfiles(result.data.Programmes);

        if (!currentfile) return;
        handlewriting(currentfile.code);
      }
    } else {
      if (
        result.message !== "All Files Fetched Successfully" &&
        result.message !== "you are offline"
      ) {
        localStorage.removeItem("token");
        settoken(null);
        localStorage.removeItem(lastfile);
        localStorage.removeItem("lastcode");
        window.location.href = "/notice";
      }
    }
  };

  useEffect(() => {
    if (currentfile) {
      const matched = monacoFormatLang.find(
        (val) => val.extension === currentfile.extension
      );

      if (matched) {
        if (currentfile.code.trim() === "") {
          setcontent(matched.defaultCode);
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

  useEffect(() => {
    fetchfiles();
    return () => {};
  }, []);

  return (
    <div className="resizable-container">
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
