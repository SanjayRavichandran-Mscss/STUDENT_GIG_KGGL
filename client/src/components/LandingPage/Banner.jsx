import React from 'react';
import Bannerimg from "../Assets/Rectangle 3.png";

function Landingpage() {
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
          <p className="text-2xl md:text-3xl font-normal">CERTIFY YOUR</p>
          <h1 className="text-6xl md:text-8xl lg:text-[120px] font-normal">SUCCESS</h1>
          <p className="text-2xl md:text-3xl lg:text-4xl">
            ELEVATE YOUR <span className="text-[#dbff00]">SKILLS</span> AND{' '}
            <span className="text-[#dbff00]">ACCREDITED CERTIFICATIONS!</span>
          </p>
          <button className="mt-6 text-white bg-[#348ABA] border-2 border-white rounded-full px-8 py-3 hover:bg-[#2a6e96] transition-colors duration-300">
            GET STARTED
          </button>
        </div>
      </div>
    </section>
  );
}

export default Landingpage;