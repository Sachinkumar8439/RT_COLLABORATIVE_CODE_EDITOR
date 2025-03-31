import React, { useState, useEffect } from 'react';

const Outputsection = ({data}) => {
  console.log('data',data);
  return (
    <div className='outputsection-container'>
        <div className='output-content content-area'>
          <p style={{padding:"4px"}}>
            {data.output}
          </p>
        <button onClick={(e)=>{
          e.preventDefault();
          data.setoutput('')
        }} style={{position:"absolute", right:"5px",bottom:"3px",background:"white",color:"black",padding:" 2px 4px",cursor:"pointer",borderRadius:"5px"}} >clear</button>
        </div>

    </div>
  );
};

export default Outputsection;