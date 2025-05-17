

import React from 'react';
import Bannerimg from "../Assets/Rectangle 3.png";
import { useNavigate } from 'react-router-dom';


function Landingpage() {
  const nav=useNavigate();
  const navpage = () => { nav('/login') }


 
  return (
    <section id='landing' className="relative h-screen w-full">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${Bannerimg})` }}
      ></div>
     
      {/* Content Overlay */}
      <div className="relative z-10 h-full flex justify-center items-center text-center text-white">
        <div className="space-y-6 tracking-[2.8px] px-4">


          <h1 className="text-3xl md:text-8xl lg:text-[80px]  text-center font-bold ">Learn. Earn. Lead.</h1>
          <p className="text-2xl md:text-3xl lg:text-4xl">
            ENHANCE YOUR  
             <span className="text-[#dbff00]"> SKILLS </span> AND{' '}
            <span className="text-[#dbff00]">KNOWLEDGE </span>through real-world experience
          </p>
          <button className="mt-6 text-white bg-[#348ABA] border-2 border-white rounded-full px-8 py-3 hover:bg-[#2a6e96] transition-colors duration-300 cursor-pointer" onClick={navpage}>
            GET STARTED
          </button>
        </div>
      </div>
    </section>
  );
}


export default Landingpage;