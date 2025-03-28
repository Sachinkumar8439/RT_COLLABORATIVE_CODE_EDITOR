import React, { useEffect, useRef, useState } from "react";
import programs from "../Controllers/program";

const DropdownMenu = ({ isVisible, position, onClose,language }) => {
  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <ul
      ref={menuRef}
      style={{
        position: "absolute",
        top: position.y,
        left: position.x,
        background: "#fff",
        border: "1px solid #ccc",
        borderRadius: "5px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        listStyle: "none",
        padding: "3px",
        margin: 0,
        zIndex: 1000,
        width: "100px",
      }}
    >
      <li
        className="menu-item"
        style={{
          padding: "2px 4px",
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
        onClick={(e) => {
          e.preventDefault();
          const programname = prompt("enter the program name");
          onClose();
          if (programname) {
            const response = programs.createProgram(
              "/code-save",

              //  yaha user ka unique key aaega ya fir id hi ye abhi string hai taki eror na aae
              null,
              programname,
              language,
            );
          }
        }}
      >
        new file
      </li>
    </ul>
  );
};

export default DropdownMenu;
