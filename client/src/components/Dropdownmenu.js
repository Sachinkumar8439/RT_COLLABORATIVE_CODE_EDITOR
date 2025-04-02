import React, { useEffect, useRef, useState } from "react";
import programs from "../Controllers/program";

const DropdownMenu = ({ isVisible, position, onClose,language,handleOpenPopup }) => {
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
  let listItems = [];
  for (let i = 0; i < 5; i++) {
    listItems.push(
      <li key={i} style={{ padding: "2px 4px", cursor: "pointer" }}>
        {i}
      </li>
    );
  }

  return (
    
    <ul
      ref={menuRef}
      style={{
        position: "absolute",
        top: position.y,
        left: position.x-80,
        background: "black",
        border: "1px solid #ccc",
        borderRadius: "5px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        listStyle: "none",
        padding: "3px",
        margin: 0,
        zIndex: 1000,
        width: "",
        color:'white',
      }}
      >
        <input type='text' placeholder="find file"></input>
      <li
        className="menu-item"
        style={{
          // background:'grey',
          padding: "2px 4px",
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
        onClick={(e) => {
          e.preventDefault();
          handleOpenPopup();
          onClose();
        }}
      >
        new file
      </li>

      {listItems}
    </ul>
  );
};

export default DropdownMenu;
