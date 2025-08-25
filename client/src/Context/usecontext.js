import React, { createContext, useEffect, useState } from "react";

export const StateContext = createContext();

export const StateProvider = ({ children }) => {
  const [output, setoutput] = useState(null);
  const [user, setuser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [language, setLanguage] = useState("select language");
  const [input, setInput] = useState("");
  const [isrunning, setisrunning] = useState(false);
  const [files, setfiles] = useState(null);
  const [token, settoken] = useState(localStorage.getItem("token") || null);
  const [currentfile, setcurrentfile] = useState(
    JSON.parse(localStorage.getItem("lastfile")) || null
  );

  const isTokenValid = (token) => {
    if (token) {
      const parts = token.split(".");
      const decode = JSON.parse(atob(parts[1]));
      return decode.exp >= Math.floor(Date.now() / 1000);
    }
    return false;
  };
  

  return (
    <StateContext.Provider
      value={{
        user,
        setuser,
        files,
        setfiles,
        token,
        settoken,
        currentfile,
        setcurrentfile,
        isrunning,
        setisrunning,
        output,
        setoutput,
        language,
        setLanguage,
        input,
        setInput,
        isTokenValid,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};
