import React, { useContext, useEffect, useState } from "react";
import { PulseLoader } from "react-spinners";
import program from '../Controllers/program'

import { StateContext } from "../Context/usecontext";
import { monacoFormatLang } from "../data";

const Terminal = ({data,isrunning,setisrunning}) => {
  const [command, setCommand] = useState("");
  const [log, setlog] = useState(null);
  const [matched,setmatched] = useState(null)
  const {currentfile,setcurrentfile,files,setfiles,token,input,setoutput} = useContext(StateContext) 
  

  const handlefilechange = (file) => {
    if(!files)
    {
      setlog("you have not file to navigate make a file first.\nUse \n sl create <filename> .");
      return
    }
    const matchedFile = files.find(
        (f) => `${f.fileName}.${f.extension}` === file
    );
    if(!matchedFile){
      setlog(`NOT FOUND ERROR>>the file ${file} not exist`)
      return;
    }
    setcurrentfile(matchedFile);
};

useEffect(()=>{
  if(currentfile)
  {
    setlog(`you are in ${currentfile.fileName}.${currentfile.extension} file`)


  }

},[currentfile])
const handlecopy = async (type)=>{
  if(type === 'link')
  {
    const response = await program.getlink('/live-editor',currentfile._id,token)
    if(response.success)
    {
      navigator.clipboard.writeText(response.link)
      setfiles((prev) =>
        prev.map((f) => (f._id === currentfile._id ? { ...f, link: response.link ,liveLinkPassword:response.password} : f))
    );
      setlog(`Link copied to Clipboard successfully , password is ${response.password}`)
      return;

    }
    

  }
  else{
    if(currentfile.liveLinkPassword.trim() === '')
    {
      setlog('this file has not password yet ... copy link first')
      return;
    }
    navigator.clipboard.writeText(currentfile && currentfile.liveLinkPassword)
    setlog(`password copied to Clipboard successfully : ${currentfile.liveLinkPassword}`)
    return;
  }


}
const handlerun = async()=>{
  setisrunning(true);
  const response = await program.getoutput(
    "/output",
    currentfile.code,
    matched.id,
    input
  );
  if (response.success) {
    setoutput(response.data);
    setisrunning(false);
    return;
  }
  setisrunning(false);
}


const handlecreatefile = async(programname)=>{
  if (programname) {
    const allreadyexist = files.find(
      (f) => `${f.fileName}.${f.extension}` === programname
    );
    if(allreadyexist)
    {
      setlog(`${programname} is allready exist. choose a different Name`)
      return;
    }
    const filename = programname.split(".");
    const matched = monacoFormatLang.find(
      (f) => f.extension === filename[1]
    );
    
    if(!matched){setlog('Not valid extension.  example of a valid filename index.cpp');
      return;
    }
    if (filename && filename.length === 2 && token && matched) {
      const response = await program.saveProgram(
        "/code-save",
        token,
        filename[0],
        filename[1],
        "",
        null
      );

      if (response.success) {
        console.log("success hai bhai ", response);
        setfiles((pre) => [response.file, ...pre]);
        setcurrentfile(response.file);
      }
    }
    setlog('Not valid extension.  example of a valid filename index.cpp')
    return;
  }

}

  const handleCommand = (cmd) => {
    const [prefix, action, ...args] = cmd.trim().split(" ");
    if (prefix !== "sl") {
      if(prefix==='clear')
      {
        setoutput(null)
        return;
      }
      setlog("Invalid command prefix. Use 'ce'.");

    }
    

    switch (action) {
      case "goto":
        const file = args.join(" ");
        handlefilechange(file);
        return;
      case "run":
        handlerun();
        return ;
      case "create":
        if ( args[0] && args[0].trim()!=='') {
          handlecreatefile(args[0].trim());

        }
        return ;
      case "copy":
        if (args[0] === "link") {
          handlecopy(args[0]);
          return `Copied link for ${currentfile || args.slice(1).join(" ")}`;
        } else if (args[0] === "password") {
          handlecopy(args[0]);
          return `Copied password for ${currentfile || args.slice(1).join(" ")}`;
        }
        setlog("Invalid copy command. Use 'sl copy link' or 'password'.");
        return;
      default:
        setlog('invalid command.. use command < ce help > to view available commands');
        return;
    }
  };

  const handleKeyPress = (e) => {
      if (e.key === "Enter") {
        console.log('enter pressed')
        setlog(null);
      handleCommand(command);
  
      setCommand(""); 
    }
  };

  useEffect(() => {
    if (currentfile && files) {
      const matched = monacoFormatLang.find(
        (f) => f.extension === currentfile.extension
      );
      if (matched) {
        setmatched(matched) 
      }
    }
  }, [setmatched,files,currentfile]); 
  

  return (
    <div style={{width:'100%',display:'flex',flexDirection:'column',position:"relative"}}>
      <div style={{height : isrunning?'40px':''}} >
      {!isrunning ? (
          <p
            style={{
              padding: "2px",
              fontSize: "15px",
              whiteSpace: "pre-wrap",
              fontFamily: "monospace",
            }}
          >
            {
             data.output && (<>
               {data.output ? data.output.status.description : ''}
            <br/>
            {data.output ? data.output.compile_output:''}
            {data.output ? data.output.stdout :''}
              </>)
            }

          </p>
        ) : (
          <div style={styles.loaderContainer}>
            <PulseLoader color="white" size={10} />
          </div>
        )}

      </div>
      {log && (
  <p style={{
    wordWrap: 'break-word', 
    overflowWrap: 'break-word', 
    whiteSpace: "pre-wrap",
    fontFamily: "monospace",
    width: '100%', 
    lineHeight: '1.5', 
  }}>
    {log}
  </p>
)}
      <div style={{
        display:'flex',
      }}>
        <span>{!currentfile ? '>': `${currentfile.fileName}.${currentfile.extension}>` }</span>
        <input
          style={{
              background:'none',
              border:'none',
              outline:'none',
              color:"white",
              flex:'1',
              whiteSpace: "pre-wrap",
              fontFamily: "monospace",
          }}
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={handleKeyPress}
        />
      </div>
    </div>
  );
};

const styles = {
    loaderContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
      width: "100%",
    },
  };

export default Terminal;
