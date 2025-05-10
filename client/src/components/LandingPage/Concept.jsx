import React from "react";
import empowermentim from "../Assets/Rectangle 19.png";
import integrityim from "../Assets/Rectangle 16.png";
import innovationim from "../Assets/Rectangle 20.png";
import communityim from "../Assets/Rectangle 18.png";

function Concept() {
  return (
    <section id="concept" className="py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl md:text-3xl font-normal tracking-[2.5px] text-center mb-10">
          WHAT SETS US APART
        </h1>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* Empowerment Card */}
          <div className="flex flex-col md:flex-row items-center rounded bg-[rgba(52,138,186,0.3)] md:bg-[#348ABA] p-4 md:p-6 gap-4 w-full">
            <img 
              src={empowermentim} 
              className="h-24 w-24 md:h-60 md:w-60 object-cover" 
              alt="Empowerment" 
            />
            <div className="text-center md:text-left">
              <h3 className="text-xl font-semibold mb-2">Empowerment</h3>
              <p className="text-sm md:text-base">
                We empower students to take charge of their careers and develop
                their professional identities
              </p>
            </div>
          </div>

          {/* Innovation Card */}
          <div className="flex flex-col md:flex-row-reverse items-center rounded bg-[rgba(52,138,186,0.3)] p-4 md:p-6 gap-4 w-full">
            <img 
              src={innovationim} 
              className="h-24 w-24 md:h-60 md:w-60 object-cover" 
              alt="Innovation" 
            />
            <div className="text-center md:text-left">
              <h3 className="text-xl font-semibold mb-2">Innovation</h3>
              <p className="text-sm md:text-base">
                We encourage creativity and out-of-the-box thinking, providing
                opportunities that challenge and inspire.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Integrity Card */}
          <div className="flex flex-col md:flex-row items-center rounded bg-[rgba(52,138,186,0.3)] p-4 md:p-6 gap-4 w-full">
            <img 
              src={integrityim} 
              className="h-24 w-24 md:h-60 md:w-60 object-cover" 
              alt="Integrity" 
            />
            <div className="text-center md:text-left">
              <h3 className="text-xl font-semibold mb-2">Integrity</h3>
              <p className="text-sm md:text-base">
                We are committed to maintaining the highest standards of honesty
                and fairness in all our interactions.
              </p>
            </div>
          </div>

          {/* Community Card */}
          <div className="flex flex-col md:flex-row-reverse items-center rounded bg-[#348ABA] p-4 md:p-6 gap-4 w-full">
            <img 
              src={communityim} 
              className="h-24 w-24 md:h-60 md:w-60 object-cover" 
              alt="Community" 
            />
            <div className="text-center md:text-left">
              <h3 className="text-xl font-semibold mb-2">Community</h3>
              <p className="text-sm md:text-base">
                We foster a supportive community where students and professionals
                can collaborate and grow together.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Concept;