import React, { useState,useEffect,useRef } from "react";
import { monacoFormatLang } from "../data";

const ProgramForm = ({ isOpen, onClose, onSubmit }) => {
  const [programName, setProgramName] = useState("");
  const [error, seterror] = useState("");
  const inputRef = useRef(null);
  const [icon,seticon] = useState(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
}, [isOpen]);

useEffect(()=>{
    if(programName.length>0)
    {
        const extention = programName.split('.');
        if(extention && extention.length === 2)
        {
            const matchedLang = monacoFormatLang.find(val => val.extension === extention[1]);
            if(matchedLang && matchedLang.extension !== '')
                {
                seticon(matchedLang.iconUrl);
                return;
            }
            seticon(null);
            return;




        }
    }

},[programName]);

  if (!isOpen) return null; 

  return (
    <div style={styles.overlay}>
      <form onSubmit={async (e) => {
    
          e.preventDefault(); 
         const result = await onSubmit(programName);
         if(!result?.success){
             seterror(result?.message);
             return;
         }
          seticon(null);
        setProgramName('')}} 
          style={styles.modal}>
        <h2 style={styles.heading}>Program Name</h2>
        {icon?<img src={icon} alt='' width='30px' />:'' }
        
        <input
          ref={inputRef}
          type="text"
          placeholder="Enter program name"
          value={programName}
          onChange={(e) =>{ 
            setProgramName(e.target.value);


        }}
          style={styles.input}
        />
        <div style={{marginBottom:"20px",color:"white"}}>{error}</div>
        <div style={styles.buttonContainer}>
          <button type="button" onClick={(e)=>{
                 e.preventDefault()
                 onClose();
                 seterror("")
                 setProgramName("");
                 seticon(null);

          }} style={styles.cancelButton}>
            Cancel
          </button>
          <button type="submit" style={styles.submitButton}>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};


const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(20, 20, 21, 0.62)", 
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000, 
  },
  modal: {
    display: "flex",
    flexDirection: "column", 
    alignItems: "center", 
    justifyContent: "center", 
    backgroundColor: "rgba(19, 24, 26, 1)",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "1px 1px 1px 2px rgba(255, 255, 255, 1)",
    textAlign: "center",
    width: "400px",
  },
  heading: {
    marginBottom: "15px",
    color: "white",
  },
  input: {
    width: "80%",
    padding: "10px",
    margin: "15px 0px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
    background:"none",
    color:"white"
  },
  buttonContainer: {
    display: "flex",
    width:'100%',
    justifyContent: "space-evenly",
  },
  cancelButton: {
    backgroundColor: "#b00e0eff",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  submitButton: {
    backgroundColor: "#090909ff",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default ProgramForm;
