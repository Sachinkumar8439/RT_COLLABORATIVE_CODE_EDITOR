import React, { createContext, useState } from "react";

export const StateContext = createContext();

export const StateProvider = ({ children }) => {
  const [output, setoutput] = useState(null);
  const [language, setLanguage] = useState("select language");
  const [input, setInput] = useState("");
  const [isrunning, setisrunning] = useState(false);

  return (
    <StateContext.Provider
      value={{isrunning,setisrunning, output, setoutput, language, setLanguage, input, setInput }}
    >
      {children}
    </StateContext.Provider>
  );
};
