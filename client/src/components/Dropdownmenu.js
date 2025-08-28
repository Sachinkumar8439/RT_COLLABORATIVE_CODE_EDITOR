import React, { useState, useEffect, useContext, useRef } from "react";
import { StateContext } from "../Context/usecontext";
import { monacoFormatLang } from "../data";
import { useNavigate } from "react-router-dom";
import program from "../Controllers/program";

const DropdownMenu = ({
  spin,
  isVisible,
  position,
  onClose,
  handleOpenPopup,
  files,
  currentfile,
  setcurrentfile,
  fileref,
  setcontent
}) => {
  const menuRef = useRef();
  const navigate = useNavigate();
  const { token, settoken, setfiles} = useContext(StateContext);
  const [filemenudata, setfilemenudata] = useState(null);

  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  const handleRightClick = (e) => {
    setfilemenudata(null);
    e.preventDefault(); 
    setMenuPosition({ top: e.clientY, left: e.width - e.clientX });
    const fileDataString = e.currentTarget.dataset.thisfile;
    const fileData = JSON.parse(fileDataString);
    if (fileData.liveLinkExpiredAt) {
      const linktime = new Date(fileData.liveLinkExpiredAt).getTime();
      const currenttime = Date.now();
      if (currenttime > linktime) {
        setfiles((prev) =>
          prev.map((f) =>
            f._id === fileData._id
              ? { ...f, link: "", liveLinkPassword: "",liveLinkExpiredAt:null }
              : f
          )
        );
        fileData.link = "";
        fileData.liveLinkPassword = "";
        fileData.liveLinkExpiredAt=null;
      }
    }

    setfilemenudata(fileData);
    setMenuVisible(true);
  };

  const handlefiledelete = async (data)=>{
      // e.preventDefault();
      console.log(data);
   const response = await program.deleteProgram('/delete-file','blabla',data._id);
   if(!response.success){
    alert(response.message);
   }
   setfiles(pre=> {
   const newfiles = pre?.filter(f=> f._id !==data._id)
    if(newfiles.length){
      setcurrentfile(newfiles[0])
      localStorage.setItem("lastfile", JSON.stringify(newfiles[0]));
    }else{
      setcurrentfile(null);
      setcontent("");
      localStorage.removeItem("lastfile");
      
    }
    return newfiles || [];
  }
)
  onClose();
   setMenuVisible(false);
   console.log(response);
      
  }

  const handleClickOutside = (e) => {
    if (e.target.closest(".menu") === null) {
      setMenuVisible(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener("Click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("Click", handleClickOutside);
    };
  }, [isVisible, onClose]);

  const handlelink = async (e) => {
    e.preventDefault();
    onClose();
    if (filemenudata && filemenudata.liveLinkPassword.trim() === "") {
      const response = await program.getlink(
        "/live-editor",
        filemenudata._id,
        token
      );
      if (response.success) {
        navigator.clipboard.writeText(response.link);
        setfiles((prev) =>
          prev.map((f) =>
            f._id === filemenudata._id
              ? {
                  ...f,
                  link: response.link,
                  liveLinkPassword: response.password,
                  liveLinkExpiredAt:response.data.liveLinkExpiredAt,
                }
              : f
          )
        );
        setMenuVisible(false);
        return;
      }
      setMenuVisible(false);
      return;
    }
    navigator.clipboard.writeText(filemenudata.link);
    setMenuVisible(false);
    return;
  };

  if (isVisible === false) return null;

  return (
    <>
      <ul
        ref={menuRef}
        style={{
          position: "absolute",
          top: position.y,
          left: position.x - 90,
          background: "rgb(255, 255, 255)",
          border: "1px solid #ccc",
          borderRadius: "5px",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          listStyle: "none",
          padding: "5px",
          // margin: 0,
          zIndex: 1000,
          width: "180px",
          maxHeight: "400px",
          overflow:"auto"
          // color:'white',
        }}
      >
        {/* <input style={{padding:'5px',borderRadius:'5px',border:'2px solid green'}} type='text' placeholder="find file"></input> */}
        <li
          className="menu-item"
          style={{
            // background:'grey',
            padding: "2px 4px",
            cursor: "pointer",
            whiteSpace: "nowrap",
            margin: "5px",
          }}
          onClick={(e) => {
            e.preventDefault();
            if(spin){
              alert("wait for fullfill of code genration")
              return
            }
            handleOpenPopup();
            onClose();
          }}
        >
          + new file
        </li>
        {files &&
          files.map((file, index) => {
            const match = monacoFormatLang.find(
              (v) => v.extension === file.extension
            );
            const filematch = file._id === (currentfile && currentfile._id);
            return (
              <li
                data-thisfile={JSON.stringify(file)}
                key={file._id}
                className="menu-item"
                style={{
                  padding: "5px 4px",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  color: filematch ? "white" : "",
                  background: filematch ? "rgb(7, 61, 87)" : "",
                  overflow:"hidden",
                }}
                onContextMenu={handleRightClick}
                onClick={(e) => {
                  e.preventDefault();
                  if(spin){
                    alert("you can not switch file untill code genration in process")
                    return;
                  }
                  fileref.current = e.currentTarget;
                  const fileDataString = e.currentTarget.dataset.thisfile;
                  const fileData = JSON.parse(fileDataString);
                  onClose();
                  setcurrentfile(fileData);
                  localStorage.setItem("lastfile", JSON.stringify(fileData));
                }}
              >
                <div style={{ display: "flex", gap: "10px" }}>
                  <img src={match.iconUrl} width="20px" alt="" />
                  <p>{`${file.fileName}.${file.extension}`}</p>
                </div>
              </li>
            );
          })}{" "}
        <li
          className="menu-item"
          style={{
            padding: "2px 4px",
            cursor: "pointer",
            whiteSpace: "nowrap",
            margin: "5px",
          }}
          onClick={(e) => {
            e.preventDefault();
            localStorage.clear();
            sessionStorage.clear()
            settoken(null);
            navigate("/");
          }}
        >
          Logout
        </li>
      </ul>
      {menuVisible && (
        <ul
          className="menu"
          style={{
            position: "absolute",
            top: menuPosition.top,
            left: menuPosition.left,
            border: "1px solid #ccc",
            padding: "5px",
            backgroundColor: "white",
            background: "rgb(255, 255, 255)",
            borderRadius: "5px",
            listStyle: "none",
            boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)",
            zIndex: 5000,
          }}
        >
          <li className="menu-item" onClick={handlelink}>
            {filemenudata.link.trim() === "" ? "Genrate Link" : "Copy Link"}
          </li>
          {filemenudata.link.trim() !== "" && (
            <li
              onClick={(e) => {
                e.preventDefault();
                navigator.clipboard.writeText(filemenudata.liveLinkPassword);
                setMenuVisible(false);
              }}
              className="menu-item"
            >
              copy password
            </li>
          )}

          <li  className="menu-item">Rename</li>
          <li onClick={()=> handlefiledelete(filemenudata)} className="menu-item">Delete</li>
        </ul>
      )}
    </>
  );
};

export default DropdownMenu;
