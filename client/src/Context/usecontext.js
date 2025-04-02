import React, { createContext, useState } from "react";

export const StateContext = createContext();

export const StateProvider = ({ children }) => {
  const [output, setoutput] = useState("output will be shown here");
  const [language, setLanguage] = useState("select language");
  const [input, setInput] = useState("");
  const [isrunning, setisrunning] = useState(false);
  let inputSimp = "";

  return (
    <StateContext.Provider
      value={{isrunning,setisrunning, output, setoutput, language, setLanguage, input, setInput,inputSimp }}
    >
      {children}
    </StateContext.Provider>
  );
};
