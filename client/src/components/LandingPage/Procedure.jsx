import React from 'react';
import img1 from "../Assets/Mask group.png";
import img2 from "../Assets/Rectangle 37.png";
import img3 from "../Assets/Rectangle 38.png";
// import img4 from "../Assets/imagegirl.png";
import img5 from "../Assets/Rectangle 40.png";
import img6 from "../Assets/Rectangle 39.png";

function Procedure() {
  return (
    <section id="procedure" className="py-12">
      {/* Mobile & Tablet View */}
      <div className="block lg:hidden" id="smd">
        <div className="flex flex-wrap justify-center">
          {[{ img: img1, title: "Sign Up", desc: "Build a profile, update projects, and upload your resume" },
            { img: img2, title: "Testing Phase", desc: "Pass skill tests to join projects" },
            { img: img3, title: "Browse Gigs", desc: "Find your skill-based project" },
            { img: img6, title: "Apply & Collaborate", desc: "Bid for projects and collaborate with our professionals" },
            { img: img5, title: "Get Paid & Certified", desc: "Get paid and receive certification from KGGeniusLabs" },
          ].map((step, index) => (
            <div key={index} className="m-2 relative group">
              <img src={step.img} alt={step.title} className="w-full max-w-[400px] max-h-[400px] object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-center px-4">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop View */}
      <div id="lgd" className="hidden lg:flex justify-center">
        <div
          className="w-[1010px] h-[600px] mt-4 relative bg-no-repeat bg-cover"
          style={{backgroundImage:"url('https://budoymv4yd.ufs.sh/f/yeB82HPiBgxfeWgfEoyxQJTr2nGh9f6VypkqW3H4mR8g75SP')" }}
        ></div>
      </div>
    </section>
  );
}

export default Procedure;
