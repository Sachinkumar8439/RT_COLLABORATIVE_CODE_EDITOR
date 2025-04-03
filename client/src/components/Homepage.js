import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import Hero from './Hero';
import { useNavigate } from 'react-router-dom';


const Homepage = () => {
 




  return (
    <div>
      <Navbar/>
      <Hero/>
      <Footer/>
       
       </div>
  );
};

export default Homepage;