// import React, { useEffect, useState } from 'react';
// import Bannerimg from "../Assets/Rectangle 3.png";
// import { useNavigate } from 'react-router-dom';
// import { useInView } from 'react-intersection-observer';

// function Counter({ target }) {
//   const [count, setCount] = useState(0);
//   const { ref, inView } = useInView({ triggerOnce: true });

//   useEffect(() => {
//     if (inView && count < target) {
//       const interval = setInterval(() => {
//         setCount((prev) => {
//           if (prev < target) return prev + 1;
//           clearInterval(interval);
//           return target;
//         });
//       }, 30); // Speed of count
//       return () => clearInterval(interval);
//     }
//   }, [inView, target, count]);

//   return <p className="text-3xl font-bold text-gray-700" ref={ref}>{count}</p>;
// }

// function Landingpage() {
//   const nav = useNavigate();
//   const [counts, setCounts] = useState({
//     totalStudents: 0,
//     totalProjects: 0,
//     liveProjects: 0,
//   });

//   useEffect(() => {
//     // Fetch total students
//     fetch('https://gig.kggeniuslabs.com/api/api/stu/count')
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.status === 'success') {
//           setCounts((prev) => ({ ...prev, totalStudents: data.totalStudents }));
//         }
//       })
//       .catch((error) => console.error('Error fetching students count:', error));

//     // Fetch total and live projects
//     fetch('https://gig.kggeniuslabs.com/api/api/stu/projects/count')
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.status === 'success') {
//           setCounts((prev) => ({
//             ...prev,
//             totalProjects: data.totalProjects,
//             liveProjects: data.liveProjects,
//           }));
//         }
//       })
//       .catch((error) => console.error('Error fetching projects count:', error));
//   }, []);

//   const navpage = () => {
//     nav('/login');
//   };

//   return (
//     <>
//       {/* Hero Section */}
//       <section id='landing' className="relative h-screen w-full">
//         <div 
//           className="absolute inset-0 bg-cover bg-center"
//           style={{ backgroundImage: `url(${Bannerimg})` }}
//         ></div>

//         <div className="relative z-10 h-full flex justify-center items-center text-center text-white">
//           <div className="space-y-6 tracking-[2.8px] px-4">
//             <h1 className="text-3xl md:text-8xl lg:text-[80px] font-bold">Learn | Earn | Lead</h1>
//             <p className="text-2xl md:text-3xl lg:text-4xl">
//               ENHANCE YOUR  
//               <span className="text-[#dbff00]"> SKILLS </span> AND{' '}
//               <span className="text-[#dbff00]">KNOWLEDGE </span>through real-world experience
//             </p>
//             <button
//               className="mt-6 text-white bg-[#348ABA] border-2 border-white rounded-full px-8 py-3 hover:bg-[#2a6e96] transition-colors duration-300"
//               onClick={navpage}
//             >
//               GET STARTED
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* Cards Section with Count-Up */}
//       <section className="py-16 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
//             {/* Card 1 */}
//             <div className="bg-[#f9fafb] shadow-lg rounded-lg p-6 hover:shadow-2xl transition">
//               <h3 className="text-xl font-semibold mb-4 text-[#348ABA]">Total Students</h3>
//               <Counter target={counts.totalStudents} />
//             </div>

//             {/* Card 2 */}
//             <div className="bg-[#f9fafb] shadow-lg rounded-lg p-6 hover:shadow-2xl transition">
//               <h3 className="text-xl font-semibold mb-4 text-[#348ABA]">Total Projects</h3>
//               <Counter target={counts.totalProjects} />
//             </div>

//             {/* Card 3 */}
//             <div className="bg-[#f9fafb] shadow-lg rounded-lg p-6 hover:shadow-2xl transition">
//               <h3 className="text-xl font-semibold mb-4 text-[#348ABA]">Live Projects</h3>
//               <Counter target={counts.liveProjects} />
//             </div>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }

// export default Landingpage;











import React, { useEffect, useState } from 'react';
import Bannerimg from "../Assets/Rectangle 3.png";
import { useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';

function Counter({ target }) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true });

  useEffect(() => {
    if (inView && count < target) {
      const interval = setInterval(() => {
        setCount((prev) => {
          if (prev < target) return prev + 1;
          clearInterval(interval);
          return target;
        });
      }, 30); // Speed of count
      return () => clearInterval(interval);
    }
  }, [inView, target, count]);

  return <p className="text-3xl font-bold text-gray-700" ref={ref}>{count}</p>;
}

function Landingpage() {
  const nav = useNavigate();
  const [counts, setCounts] = useState({
    totalStudents: 0,
    totalProjects: 0,
    liveProjects: 0,
    completedProjects: 0, // Added completedProjects
  });

  useEffect(() => {
    // Fetch total students
    fetch('https://gig.kggeniuslabs.com/api/api/stu/count')
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'success') {
          setCounts((prev) => ({ ...prev, totalStudents: data.totalStudents }));
        }
      })
      .catch((error) => console.error('Error fetching students count:', error));

    // Fetch total, live, and completed projects
    fetch('https://gig.kggeniuslabs.com/api/api/stu/projects/count')
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'success') {
          setCounts((prev) => ({
            ...prev,
            totalProjects: data.totalProjects,
            liveProjects: data.liveProjects,
            completedProjects: data.completedProjects, // Added completedProjects
          }));
        }
      })
      .catch((error) => console.error('Error fetching projects count:', error));
  }, []);

  const navigateToLogin = () => {
    nav('/login');
  };

  return (
    <>
      {/* Hero Section */}
      <section id='hero' className="relative h-screen w-full">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${Bannerimg})` }}
        ></div>

        <div className="relative z-10 h-full flex justify-center items-center text-center text-white">
          <div className="space-y-6 tracking-[2.8px] px-4">
            <h1 className="text-3xl md:text-8xl lg:text-[80px] font-bold">Learn | Earn | Lead</h1>
            <p className="text-2xl md:text-3xl lg:text-4xl">
              ENHANCE YOUR  
              <span className="text-[#dbff00]"> SKILLS </span> AND{' '}
              <span className="text-[#dbff00]">KNOWLEDGE </span>through real-world experience
            </p>
            <button
              className="mt-6 text-white bg-[#348ABA] border-2 border-white rounded-lg px-8 py-3 hover:bg-[#2a6e96] transition-colors duration-300"
              onClick={navigateToLogin}
            >
              GET STARTED
            </button>
          </div>
        </div>
      </section>

      {/* Cards Section with Count-Up */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {/* Card 1: Total Students */}
            <div className="bg-[#f9fafb] shadow-lg rounded-lg p-6 hover:shadow-2xl transition">
              <h3 className="text-xl font-semibold mb-4 text-[#348ABA]">Total Students</h3>
              <Counter target={counts.totalStudents} />
            </div>

            {/* Card 2: Total Projects */}
            <div className="bg-[#f9fafb] shadow-lg rounded-lg p-6 hover:shadow-2xl transition">
              <h3 className="text-xl font-semibold mb-4 text-[#348ABA]">Total Projects</h3>
              <Counter target={counts.totalProjects} />
            </div>

            {/* Card 3: Live Projects */}
            <div className="bg-[#f9fafb] shadow-lg rounded-lg p-6 hover:shadow-2xl transition">
              <h3 className="text-xl font-semibold mb-4 text-[#348ABA]">Live Projects</h3>
              <Counter target={counts.liveProjects} />
            </div>

            {/* Card 4: Completed Projects */}
            <div className="bg-[#f9fafb] shadow-lg rounded-lg p-6 hover:shadow-2xl transition">
              <h3 className="text-xl font-semibold mb-4 text-[#348ABA]">Completed Projects</h3>
              <Counter target={counts.completedProjects} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Landingpage;