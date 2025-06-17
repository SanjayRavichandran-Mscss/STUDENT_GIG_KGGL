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
//     completedProjects: 0, // Added completedProjects
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

//     // Fetch total, live, and completed projects
//     fetch('https://gig.kggeniuslabs.com/api/api/stu/projects/count')
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.status === 'success') {
//           setCounts((prev) => ({
//             ...prev,
//             totalProjects: data.totalProjects,
//             liveProjects: data.liveProjects,
//             completedProjects: data.completedProjects, // Added completedProjects
//           }));
//         }
//       })
//       .catch((error) => console.error('Error fetching projects count:', error));
//   }, []);

//   const navigateToLogin = () => {
//     nav('/login');
//   };

//   return (
//     <>
//       {/* Hero Section */}
//       <section id='hero' className="relative h-screen w-full">
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
//               className="mt-6 text-white bg-[#348ABA] border-2 border-white rounded-lg px-8 py-3 hover:bg-[#2a6e96] transition-colors duration-300"
//               onClick={navigateToLogin}
//             >
//               GET STARTED
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* Cards Section with Count-Up */}
//       <section className="py-16 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
//             {/* Card 1: Total Students */}
//             <div className="bg-[#f9fafb] shadow-lg rounded-lg p-6 hover:shadow-2xl transition">
//               <h3 className="text-xl font-semibold mb-4 text-[#348ABA]">Total Students</h3>
//               <Counter target={counts.totalStudents} />
//             </div>

//             {/* Card 2: Total Projects */}
//             <div className="bg-[#f9fafb] shadow-lg rounded-lg p-6 hover:shadow-2xl transition">
//               <h3 className="text-xl font-semibold mb-4 text-[#348ABA]">Total Projects</h3>
//               <Counter target={counts.totalProjects} />
//             </div>

//             {/* Card 3: Live Projects */}
//             <div className="bg-[#f9fafb] shadow-lg rounded-lg p-6 hover:shadow-2xl transition">
//               <h3 className="text-xl font-semibold mb-4 text-[#348ABA]">Live Projects</h3>
//               <Counter target={counts.liveProjects} />
//             </div>

//             {/* Card 4: Completed Projects */}
//             <div className="bg-[#f9fafb] shadow-lg rounded-lg p-6 hover:shadow-2xl transition">
//               <h3 className="text-xl font-semibold mb-4 text-[#348ABA]">Completed Projects</h3>
//               <Counter target={counts.completedProjects} />
//             </div>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }

// export default Landingpage;





































// import React, { useEffect, useState } from 'react';
// import Bannerimg from "../Assets/Rectangle 3.png";
// import { useNavigate } from 'react-router-dom';
// import { useInView } from 'react-intersection-observer';
// import ProgressBar from '@ramonak/react-progress-bar';

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
//     completedProjects: 0,
//   });
//   const [relatedData, setRelatedData] = useState({
//     skill_counts: [],
//   });
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(true);

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

//     // Fetch total, live, and completed projects
//     fetch('https://gig.kggeniuslabs.com/api/api/stu/projects/count')
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.status === 'success') {
//           setCounts((prev) => ({
//             ...prev,
//             totalProjects: data.totalProjects,
//             liveProjects: data.liveProjects,
//             completedProjects: data.completedProjects,
//           }));
//         }
//       })
//       .catch((error) => console.error('Error fetching projects count:', error));

//     // Fetch related skill and test data
//     fetch('https://gig.kggeniuslabs.com/api/api/admin/related-student-skill-and-test-counts')
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.status === true) {
//           setRelatedData(data.result);
//         }
//       })
//       .catch((error) => console.error('Error fetching related data:', error))
//       .finally(() => setLoading(false));
//   }, []);

//   const navigateToLogin = () => {
//     nav('/login');
//   };

//   // Filter skills based on search term
//   const filteredSkills = relatedData.skill_counts.filter((skill) =>
//     skill.skill_name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Calculate total counts for beginner, intermediate, advanced
//   const calculateTotals = (skill, level) => {
//     const colleges = ['KGCAS', 'KITE', 'KGISL IIM'];
//     return colleges.reduce((sum, college) => {
//       const count = skill.test_levels.find(c => c.college_name === college)?.[`${level}_count`] || 0;
//       return sum + count;
//     }, 0);
//   };

//   return (
//     <>
//       {/* Hero Section */}
//       <section id='hero' className="relative h-screen w-full">
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
//               className="mt-6 text-white bg-[#348ABA] border-2 border-white rounded-lg px-8 py-3 hover:bg-[#2a6e96] transition-colors duration-300"
//               onClick={navigateToLogin}
//             >
//               GET STARTED
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* Cards Section with Count-Up */}
//       <section className="py-16 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
//             {/* Card 1: Total Students */}
//             <div className="bg-[#f9fafb] shadow-lg rounded-lg p-6 hover:shadow-2xl transition">
//               <h3 className="text-xl font-semibold mb-4 text-[#348ABA]">Total Students</h3>
//               <Counter target={counts.totalStudents} />
//             </div>

//             {/* Card 2: Total Projects */}
//             <div className="bg-[#f9fafb] shadow-lg rounded-lg p-6 hover:shadow-2xl transition">
//               <h3 className="text-xl font-semibold mb-4 text-[#348ABA]">Total Projects</h3>
//               <Counter target={counts.totalProjects} />
//             </div>

//             {/* Card 3: Live Projects */}
//             <div className="bg-[#f9fafb] shadow-lg rounded-lg p-6 hover:shadow-2xl transition">
//               <h3 className="text-xl font-semibold mb-4 text-[#348ABA]">Live Projects</h3>
//               <Counter target={counts.liveProjects} />
//             </div>

//             {/* Card 4: Completed Projects */}
//             <div className="bg-[#f9fafb] shadow-lg rounded-lg p-6 hover:shadow-2xl transition">
//               <h3 className="text-xl font-semibold mb-4 text-[#348ABA]">Completed Projects</h3>
//               <Counter target={counts.completedProjects} />
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Skill and Test Statistics Table */}
//       <section className="py-16 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <h2 className="text-2xl font-semibold mb-6 text-[#348ABA] text-center">Skill and Test Statistics</h2>
//           <div className="bg-[#f9fafb] shadow-lg rounded-lg p-6 overflow-x-auto">
//             {loading ? (
//               <p className="text-center text-gray-500 animate-pulse">Loading data...</p>
//             ) : (
//               <table className="w-full text-left min-w-[1200px]">
//                 <thead>
//                   <tr className="text-[#348ABA] border-b">
//                     <th className="py-3 px-4 font-semibold">
//                       <div className="mb-2">
//                         <input
//                           type="text"
//                           placeholder="Search by skill name..."
//                           value={searchTerm}
//                           onChange={(e) => setSearchTerm(e.target.value)}
//                           className="w-full px-3 py-2 rounded-lg border-2 border-[#348ABA] focus:outline-none focus:ring-2 focus:ring-[#348ABA] text-gray-700 bg-white"
//                         />
//                       </div>
//                       Skills
//                     </th>
//                     <th className="py-3 px-4 font-semibold">Enrolled</th>
//                     <th className="py-3 px-4 font-semibold">Test</th>
//                     <th className="py-3 px-4 font-semibold">Beginner</th>
//                     <th className="py-3 px-4 font-semibold">Intermediate</th>
//                     <th className="py-3 px-4 font-semibold">Advanced</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredSkills.length === 0 ? (
//                     <tr>
//                       <td colSpan="6" className="py-3 px-4 text-center text-gray-500">
//                         No skills match the search term
//                       </td>
//                     </tr>
//                   ) : (
//                     filteredSkills.map((skill, index) => (
//                       <tr key={index} className="text-gray-700 hover:bg-gray-100 transition-colors duration-200">
//                         <td className="py-3 px-4">{skill.skill_name}</td>
//                         <td className="py-3 px-4">
//                           <table className="w-full text-sm">
//                             <tbody>
//                               <tr>
//                                 <td className="py-1 pr-2">Total:</td>
//                                 <td className="py-1">{skill.total_enrolled}</td>
//                                 <td className="py-1"><ProgressBar completed={skill.total_enrolled} maxCompleted={100} bgColor="#348ABA" height="8px" /></td>
//                               </tr>
//                               <tr>
//                                 <td className="py-1 pr-2">KGCAS:</td>
//                                 <td className="py-1">{skill.kgcas_count}</td>
//                                 <td className="py-1"><ProgressBar completed={skill.kgcas_count} maxCompleted={100} bgColor="#348ABA" height="8px" /></td>
//                               </tr>
//                               <tr>
//                                 <td className="py-1 pr-2">KITE:</td>
//                                 <td className="py-1">{skill.kite_count}</td>
//                                 <td className="py-1"><ProgressBar completed={skill.kite_count} maxCompleted={100} bgColor="#348ABA" height="8px" /></td>
//                               </tr>
//                               <tr>
//                                 <td className="py-1 pr-2">KGISL IIM:</td>
//                                 <td className="py-1">{skill.kgisliim_count}</td>
//                                 <td className="py-1"><ProgressBar completed={skill.kgisliim_count} maxCompleted={100} bgColor="#348ABA" height="8px" /></td>
//                               </tr>
//                             </tbody>
//                           </table>
//                         </td>
//                         <td className="py-3 px-4">
//                           <table className="w-full text-sm">
//                             <tbody>
//                               <tr>
//                                 <td className="py-1 pr-2">Total:</td>
//                                 <td className="py-1">{skill.test_attendance.total}</td>
//                                 <td className="py-1"><ProgressBar completed={skill.test_attendance.total} maxCompleted={100} bgColor="#348ABA" height="8px" /></td>
//                               </tr>
//                               <tr>
//                                 <td className="py-1 pr-2">KGCAS:</td>
//                                 <td className="py-1">{skill.test_attendance.kgcas}</td>
//                                 <td className="py-1"><ProgressBar completed={skill.test_attendance.kgcas} maxCompleted={100} bgColor="#348ABA" height="8px" /></td>
//                               </tr>
//                               <tr>
//                                 <td className="py-1 pr-2">KITE:</td>
//                                 <td className="py-1">{skill.test_attendance.kite}</td>
//                                 <td className="py-1"><ProgressBar completed={skill.test_attendance.kite} maxCompleted={100} bgColor="#348ABA" height="8px" /></td>
//                               </tr>
//                               <tr>
//                                 <td className="py-1 pr-2">KGISL IIM:</td>
//                                 <td className="py-1">{skill.test_attendance.kgisliim}</td>
//                                 <td className="py-1"><ProgressBar completed={skill.test_attendance.kgisliim} maxCompleted={100} bgColor="#348ABA" height="8px" /></td>
//                               </tr>
//                             </tbody>
//                           </table>
//                         </td>
//                         <td className="py-3 px-4">
//                           <table className="w-full text-sm">
//                             <tbody>
//                               <tr>
//                                 <td className="py-1 pr-2">Total:</td>
//                                 <td className="py-1">{calculateTotals(skill, 'beginner')}</td>
//                                 <td className="py-1"><ProgressBar completed={calculateTotals(skill, 'beginner')} maxCompleted={100} bgColor="#348ABA" height="8px" /></td>
//                               </tr>
//                               <tr>
//                                 <td className="py-1 pr-2">KGCAS:</td>
//                                 <td className="py-1">{skill.test_levels.find(c => c.college_name === 'KGCAS')?.beginner_count || 0}</td>
//                                 <td className="py-1"><ProgressBar completed={skill.test_levels.find(c => c.college_name === 'KGCAS')?.beginner_count || 0} maxCompleted={100} bgColor="#348ABA" height="8px" /></td>
//                               </tr>
//                               <tr>
//                                 <td className="py-1 pr-2">KITE:</td>
//                                 <td className="py-1">{skill.test_levels.find(c => c.college_name === 'KITE')?.beginner_count || 0}</td>
//                                 <td className="py-1"><ProgressBar completed={skill.test_levels.find(c => c.college_name === 'KITE')?.beginner_count || 0} maxCompleted={100} bgColor="#348ABA" height="8px" /></td>
//                               </tr>
//                               <tr>
//                                 <td className="py-1 pr-2">KGISL IIM:</td>
//                                 <td className="py-1">{skill.test_levels.find(c => c.college_name === 'KGISL IIM')?.beginner_count || 0}</td>
//                                 <td className="py-1"><ProgressBar completed={skill.test_levels.find(c => c.college_name === 'KGISL IIM')?.beginner_count || 0} maxCompleted={100} bgColor="#348ABA" height="8px" /></td>
//                               </tr>
//                             </tbody>
//                           </table>
//                         </td>
//                         <td className="py-3 px-4">
//                           <table className="w-full text-sm">
//                             <tbody>
//                               <tr>
//                                 <td className="py-1 pr-2">Total:</td>
//                                 <td className="py-1">{calculateTotals(skill, 'intermediate')}</td>
//                                 <td className="py-1"><ProgressBar completed={calculateTotals(skill, 'intermediate')} maxCompleted={100} bgColor="#348ABA" height="8px" /></td>
//                               </tr>
//                               <tr>
//                                 <td className="py-1 pr-2">KGCAS:</td>
//                                 <td className="py-1">{skill.test_levels.find(c => c.college_name === 'KGCAS')?.intermediate_count || 0}</td>
//                                 <td className="py-1"><ProgressBar completed={skill.test_levels.find(c => c.college_name === 'KGCAS')?.intermediate_count || 0} maxCompleted={100} bgColor="#348ABA" height="8px" /></td>
//                               </tr>
//                               <tr>
//                                 <td className="py-1 pr-2">KITE:</td>
//                                 <td className="py-1">{skill.test_levels.find(c => c.college_name === 'KITE')?.intermediate_count || 0}</td>
//                                 <td className="py-1"><ProgressBar completed={skill.test_levels.find(c => c.college_name === 'KITE')?.intermediate_count || 0} maxCompleted={100} bgColor="#348ABA" height="8px" /></td>
//                               </tr>
//                               <tr>
//                                 <td className="py-1 pr-2">KGISL IIM:</td>
//                                 <td className="py-1">{skill.test_levels.find(c => c.college_name === 'KGISL IIM')?.intermediate_count || 0}</td>
//                                 <td className="py-1"><ProgressBar completed={skill.test_levels.find(c => c.college_name === 'KGISL IIM')?.intermediate_count || 0} maxCompleted={100} bgColor="#348ABA" height="8px" /></td>
//                               </tr>
//                             </tbody>
//                           </table>
//                         </td>
//                         <td className="py-3 px-4">
//                           <table className="w-full text-sm">
//                             <tbody>
//                               <tr>
//                                 <td className="py-1 pr-2">Total:</td>
//                                 <td className="py-1">{calculateTotals(skill, 'advanced')}</td>
//                                 <td className="py-1"><ProgressBar completed={calculateTotals(skill, 'advanced')} maxCompleted={100} bgColor="#348ABA" height="8px" /></td>
//                               </tr>
//                               <tr>
//                                 <td className="py-1 pr-2">KGCAS:</td>
//                                 <td className="py-1">{skill.test_levels.find(c => c.college_name === 'KGCAS')?.advanced_count || 0}</td>
//                                 <td className="py-1"><ProgressBar completed={skill.test_levels.find(c => c.college_name === 'KGCAS')?.advanced_count || 0} maxCompleted={100} bgColor="#348ABA" height="8px" /></td>
//                               </tr>
//                               <tr>
//                                 <td className="py-1 pr-2">KITE:</td>
//                                 <td className="py-1">{skill.test_levels.find(c => c.college_name === 'KITE')?.advanced_count || 0}</td>
//                                 <td className="py-1"><ProgressBar completed={skill.test_levels.find(c => c.college_name === 'KITE')?.advanced_count || 0} maxCompleted={100} bgColor="#348ABA" height="8px" /></td>
//                               </tr>
//                               <tr>
//                                 <td className="py-1 pr-2">KGISL IIM:</td>
//                                 <td className="py-1">{skill.test_levels.find(c => c.college_name === 'KGISL IIM')?.advanced_count || 0}</td>
//                                 <td className="py-1"><ProgressBar completed={skill.test_levels.find(c => c.college_name === 'KGISL IIM')?.advanced_count || 0} maxCompleted={100} bgColor="#348ABA" height="8px" /></td>
//                               </tr>
//                             </tbody>
//                           </table>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             )}
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
      }, 30);
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
    completedProjects: 0,
  });
  const [relatedData, setRelatedData] = useState({
    skill_counts: [],
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://gig.kggeniuslabs.com/api/api/stu/count')
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'success') {
          setCounts((prev) => ({ ...prev, totalStudents: data.totalStudents }));
        }
      })
      .catch((error) => console.error('Error fetching students count:', error));

    fetch('https://gig.kggeniuslabs.com/api/api/stu/projects/count')
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'success') {
          setCounts((prev) => ({
            ...prev,
            totalProjects: data.totalProjects,
            liveProjects: data.liveProjects,
            completedProjects: data.completedProjects,
          }));
        }
      })
      .catch((error) => console.error('Error fetching projects count:', error));

    fetch('https://gig.kggeniuslabs.com/api/api/admin/related-student-skill-and-test-counts')
      .then((response) => response.json())
      .then((data) => {
        if (data.status === true) {
          setRelatedData(data.result);
        }
      })
      .catch((error) => console.error('Error fetching related data:', error))
      .finally(() => setLoading(false));
  }, []);

  const navigateToLogin = () => {
    nav('/login');
  };

  const filteredSkills = relatedData.skill_counts.filter((skill) =>
    skill.skill_name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  //   const colleges = ['KGCAS', 'KITE', 'KGISL IIM'];
  //   return colleges.reduce((sum, college) => {
  //     const count = skill.test_levels.find(c => c.college_name === college)?.[`${level}_count`] || 0;
  //     return sum + count;
  //   }, 0);
  // };

  // Render a consistent table cell with college columns
  const renderTableCell = (data) => {
    return (
      <div className="w-full">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[#348ABA] text-xs font-semibold">
              <th className="py-1 px-2 text-center">Total</th>
              <th className="py-1 px-2 text-center">KGCAS</th>
              <th className="py-1 px-2 text-center">KITE</th>
              <th className="py-1 px-2 text-center">KGISL IIM</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-2 text-center font-medium">{data.total}</td>
              <td className="py-2 px-2 text-center">{data.kgcas}</td>
              <td className="py-2 px-2 text-center">{data.kite}</td>
              <td className="py-2 px-2 text-center">{data.kgisliim}</td>
            </tr>

          </tbody>
        </table>
      </div>
    );
  };

  // Render test level cell
  const renderTestLevelCell = (skill, level) => {
    const kgcas = skill.test_levels.find(c => c.college_name === 'KGCAS')?.[`${level}_count`] || 0;
    const kite = skill.test_levels.find(c => c.college_name === 'KITE')?.[`${level}_count`] || 0;
    const kgisliim = skill.test_levels.find(c => c.college_name === 'KGISL IIM')?.[`${level}_count`] || 0;
    const total = kgcas + kite + kgisliim;

    return (
      <div className="w-full">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[#348ABA] text-xs font-semibold">
              <th className="py-1 px-2 text-center">Total</th>
              <th className="py-1 px-2 text-center">KGCAS</th>
              <th className="py-1 px-2 text-center">KITE</th>
              <th className="py-1 px-2 text-center">KGISL IIM</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-2 text-center font-medium">{total}</td>
              <td className="py-2 px-2 text-center">{kgcas}</td>
              <td className="py-2 px-2 text-center">{kite}</td>
              <td className="py-2 px-2 text-center">{kgisliim}</td>
    
            </tr>
          </tbody>
        </table>
      </div>
    );
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

      {/* Cards Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="bg-[#f9fafb] shadow-lg rounded-lg p-6 hover:shadow-2xl transition">
              <h3 className="text-xl font-semibold mb-4 text-[#348ABA]">Total Students</h3>
              <Counter target={counts.totalStudents} />
            </div>
            <div className="bg-[#f9fafb] shadow-lg rounded-lg p-6 hover:shadow-2xl transition">
              <h3 className="text-xl font-semibold mb-4 text-[#348ABA]">Total Projects</h3>
              <Counter target={counts.totalProjects} />
            </div>
            <div className="bg-[#f9fafb] shadow-lg rounded-lg p-6 hover:shadow-2xl transition">
              <h3 className="text-xl font-semibold mb-4 text-[#348ABA]">Live Projects</h3>
              <Counter target={counts.liveProjects} />
            </div>
            <div className="bg-[#f9fafb] shadow-lg rounded-lg p-6 hover:shadow-2xl transition">
              <h3 className="text-xl font-semibold mb-4 text-[#348ABA]">Completed Projects</h3>
              <Counter target={counts.completedProjects} />
            </div>
          </div>
        </div>
      </section>

      {/* Skill and Test Statistics Table */}
      <section className="py-16 bg-white">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold mb-6 text-[#348ABA] text-center">Skill and Test Statistics</h2>
          <div className="bg-[#f9fafb] shadow-lg rounded-lg p-6 overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#348ABA]"></div>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Search by skill name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-1/3 px-4 py-2 rounded-lg border-2 border-[#348ABA] focus:outline-none focus:ring-2 focus:ring-[#348ABA] text-gray-700 bg-white"
                  />
                </div>
              <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-[#348ABA] uppercase tracking-wider">
                          Skills
                        </th>
                        <th scope="col" className="px-6 py-4 text-center text-sm font-semibold text-[#348ABA] uppercase tracking-wider">
                          Enrolled
                        </th>
                        <th scope="col" className="px-6 py-4 text-center text-sm font-semibold text-[#348ABA] uppercase tracking-wider">
                          Test Attendees
                        </th>
                        <th scope="col" className="px-6 py-4 text-center text-sm font-semibold text-[#348ABA] uppercase tracking-wider">
                          Beginner
                        </th>
                        <th scope="col" className="px-6 py-4 text-center text-sm font-semibold text-[#348ABA] uppercase tracking-wider">
                          Intermediate
                        </th>
                        <th scope="col" className="px-6 py-4 text-center text-sm font-semibold text-[#348ABA] uppercase tracking-wider">
                          Advanced
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredSkills.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                            No skills found matching "{searchTerm}"
                          </td>
                        </tr>
                      ) : (
                        filteredSkills.map((skill, index) => (
                          <tr 
                            key={index} 
                            className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {skill.skill_name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {renderTableCell({
                                total: skill.total_enrolled,
                                kgcas: skill.kgcas_count,
                                kite: skill.kite_count,
                                kgisliim: skill.kgisliim_count
                              })}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {renderTableCell({
                                total: skill.test_attendance.total,
                                kgcas: skill.test_attendance.kgcas,
                                kite: skill.test_attendance.kite,
                                kgisliim: skill.test_attendance.kgisliim
                              })}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {renderTestLevelCell(skill, 'beginner')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {renderTestLevelCell(skill, 'intermediate')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {renderTestLevelCell(skill, 'advanced')}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default Landingpage;