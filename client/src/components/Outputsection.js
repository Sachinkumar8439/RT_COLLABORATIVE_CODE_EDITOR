import React, { useState, useEffect, useContext } from "react";
import { StateContext } from "../Context/usecontext";
import { PulseLoader } from "react-spinners";


const Outputsection = ({data}) => {
  const {isrunning} = useContext(StateContext)
  console.log('data',data);
  return (
    <div className='outputsection-container'>
        <div className='output-content content-area'>

        {  !isrunning ? <p style={{padding:"4px",fontSize:'15px'}}>
            {data.output}
          </p> : <div style={styles.loaderContainer}>
      <PulseLoader color="white" size={15} />
    </div>
    }

         
        <button onClick={(e)=>{
          e.preventDefault();
          data.setoutput('')
        }} style={{position:"absolute", right:"5px",bottom:"3px",background:"white",color:"black",padding:" 2px 4px",cursor:"pointer",borderRadius:"5px"}} >clear</button>
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

export default Outputsection;