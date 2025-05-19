import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Addskill() {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');

  const fetchSkills = () => {
    fetch('http://localhost:5000/api/quiz/skills')
      .then((response) => response.json())
      .then((data) => {
        setSkills(data); // show all skills regardless of skill_status
      })
      .catch((error) => {
        toast.error('Error fetching skills.', {
          position: 'top-right',
          autoClose: 3000,
        });
        console.error('Error fetching skills:', error);
      });
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newSkill.trim()) {
      toast.warn('Please enter a skill name.', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    const newSkillData = {
      skill_name: newSkill.trim(),
      skill_status: 0 // default status
    };

    fetch('http://localhost:5000/api/quiz/skills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSkillData)
    })
      .then((res) => {
        if (res.ok) {
          toast.success('Skill added successfully!', {
            position: 'top-right',
            autoClose: 3000,
          });
          setNewSkill('');
          fetchSkills();
        } else {
          toast.error('Failed to add skill.', {
            position: 'top-right',
            autoClose: 3000,
          });
        }
      })
      .catch(() => {
        toast.error('Server error while adding skill.', {
          position: 'top-right',
          autoClose: 3000,
        });
      });
  };

  return (
    <div className="w-full p-6 bg-gray-50 min-h-screen">
      <div className="text-2xl font-semibold text-center mb-6">Skill Management</div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Skill Table */}
        <div className="w-full md:w-1/2 bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full table-auto">
            <thead className="bg-blue-100 text-blue-800">
              <tr>
                <th className="p-3 text-left border-b">S.NO</th>
                <th className="p-3 text-left border-b">Skill</th>
              </tr>
            </thead>
            <tbody>
              {skills.length > 0 ? (
                skills.map((skill, index) => (
                  <tr key={skill.skill_id} className="hover:bg-gray-100">
                    <td className="p-3 border-b">{index + 1}</td>
                    <td className="p-3 border-b">{skill.skill_name}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="p-4 text-center text-gray-500">No skills found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add Skill Form */}
        <form onSubmit={handleSubmit} className="w-full md:w-1/2 bg-white shadow-md rounded-lg p-6 flex flex-col gap-4">
          <label className="font-medium text-gray-700">Add Skill</label>
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="e.g. JavaScript"
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
          >
            Add Skill
          </button>
        </form>
      </div>

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
}

export default Addskill;
