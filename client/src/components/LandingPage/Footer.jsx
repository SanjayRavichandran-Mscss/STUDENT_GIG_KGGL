import React from 'react';
import footimg from "../Assets/web 1-01 1.png";

function Footer() {
  return (
    <section id='community' className="bg-[#348ABA]">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row items-center">
          {/* Logo Section */}
          <div className="lg:w-1/3 mb-8 lg:mb-0 flex justify-center lg:justify-start">
            <img 
              src={footimg} 
              className="h-48 w-48 object-contain" 
              alt="KG Genius Labs Logo" 
            />
          </div>

          {/* Spacer for larger screens */}
          <div className="hidden lg:block lg:w-1/6"></div>

          {/* Text Content Section */}
          <div className="lg:w-1/2 text-center lg:text-left text-white">
            <h1 className="text-2xl md:text-3xl tracking-[2.8px] mb-4">
              JOIN OUR COMMUNITY
            </h1>
            <p className="text-lg md:text-xl tracking-[2px] mb-6">
              For students seeking experience or businesses in need of freelancers, 
              KG Genius Labs Gig opens doors to endless opportunities. Join us now 
              for growth, learning, and success!
            </p>
            <button className="bg-white text-[#348ABA] w-36 h-12 font-medium hover:bg-gray-100 transition-colors">
              Join now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Footer;