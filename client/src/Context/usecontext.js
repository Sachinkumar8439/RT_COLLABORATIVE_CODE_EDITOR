import React, { createContext, useState } from "react";

export const StateContext = createContext();

export const StateProvider = ({ children }) => {
  const [output, setoutput] = useState("output will be shown here");
  const [language, setLanguage] = useState("select language");
  const [input,setInput] = useState("input");

  return (
    <StateContext.Provider value={{ output, setoutput, language, setLanguage,input,setInput }}>
      {children}
    </StateContext.Provider>
  );
};
