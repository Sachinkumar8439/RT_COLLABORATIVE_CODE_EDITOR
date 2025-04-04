import React, { createContext, useState } from "react";

export const StateContext = createContext();

export const StateProvider = ({ children }) => {
  const [output, setoutput] = useState(null);
  const [language, setLanguage] = useState("select language");
  const [input, setInput] = useState("");
  const [isrunning, setisrunning] = useState(false);
  // const [token,setToken] = useState(localStorage.getItem('token') || null);

  const isTokenValid = (token) => {
    if(token){
      const parts = token.split(".");
      const decode = JSON.parse(atob(parts[1]));
      console.log("decoded token time:",decode.exp,":",Math.floor(Date.now()/1000));
      // console.log("token validate:",decode.exp >= Math.floor(Date.now()/1000));
      return decode.exp >= Math.floor(Date.now()/1000);
    }
    return false;
  }

  return (
    <StateContext.Provider
      value={{isrunning,setisrunning, output, setoutput, language, setLanguage, input, setInput,isTokenValid}}
    >
      {children}
    </StateContext.Provider>
  );
};
