import React, { useEffect, useRef, useState } from "react";
import programs from "../Controllers/program";
import { monacoFormatLang } from "../data";

const DropdownMenu = ({ isVisible, position, onClose,language,handleOpenPopup,files,currentfile,setcurrentfile,fileref}) => {
  const menuRef = useRef();
 
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
  }, [isVisible]);

  if (isVisible === false) return null;

  return (
    
    <ul
      ref={menuRef}
      style={{
        position: "absolute",
        top: position.y,
        left: position.x-90,
        background: "rgb(255, 255, 255)",
        border: "1px solid #ccc",
        borderRadius: "5px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        listStyle: "none",
        padding: "5px",
        // margin: 0,
        zIndex: 1000,
        width: "180px",
        maxHeight:'400px'
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
          margin:'5px'
        }}
        onClick={(e) => {
          e.preventDefault();
          handleOpenPopup();
          onClose();
        }}
      >
      + new file
      </li>
      {files && files.map((file, index) => {
        const match = monacoFormatLang.find(v => v.extension === file.extension);
        const filematch = file._id === (currentfile && currentfile._id);
      return (
        <li
        // ref={fileref}
        data-thisfile = {JSON.stringify(file)}
        key={file._id}
        className="menu-item"
        
        style={{
          // background:'grey',
          padding: "5px 4px",
          cursor: "pointer",
          whiteSpace: "nowrap",
          color:filematch ? "white":'',
          background:filematch?'rgb(7, 61, 87)':"",
        }}
        onClick={(e) => {
          e.preventDefault();
          fileref.current = e.currentTarget; 
          const fileDataString = e.currentTarget.dataset.thisfile;
          const fileData = JSON.parse(fileDataString);
          console.log('Clicked element:', fileref.current);
          console.log('File data:', file);
          onClose();
          setcurrentfile(fileData);
          localStorage.setItem('lastfile',JSON.stringify(fileData))
        }}
      >
        <div style={{display:'flex',gap:'10px'}}>

        <img src={match.iconUrl} width='20px' alt=''/>
       <p>
        {`${file.fileName}.${file.extension}`}
       </p>
        </div>
      </li>
  );
})}

    </ul>
  );
};

export default DropdownMenu;
