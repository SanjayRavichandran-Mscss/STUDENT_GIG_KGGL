import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { Pencil, Trash2, Search, Check, Plus, X } from 'lucide-react';
import Modal from 'react-modal';

// Bind modal to app element for accessibility
Modal.setAppElement('#root');

function Addskill() {
  
  const [skills, setSkills] = useState([]);
  const [activeSkills, setActiveSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [editingSkill, setEditingSkill] = useState(null);
  const [editingSkillName, setEditingSkillName] = useState('');
  const [originalSkillName, setOriginalSkillName] = useState(''); // Store original skill name
  const [adminFilter, setAdminFilter] = useState('');
  const [studentFilter, setStudentFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch all skills (inactive only for admin table)
  const fetchSkills = async () => {
    try {
      const response = await fetch('https://gig.kggeniuslabs.com/apiapi/test/skills');
      const data = await response.json();
      setSkills(data.filter((skill) => skill.skill_status === 0)); // Only inactive skills
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch skills. Please try again.',
        confirmButtonColor: '#dc2626',
        customClass: {
          popup: 'rounded-md shadow-lg',
          title: 'text-lg font-semibold text-gray-800',
          content: 'text-gray-600',
          confirmButton: 'px-3 py-1.5 text-white font-medium rounded-md',
        },
      });
      console.error('Error fetching skills:', error);
    }
  };

  // Fetch active skills (skill_status = 1)
  const fetchActiveSkills = async () => {
    try {
      const response = await fetch('https://gig.kggeniuslabs.com/apiapi/test/skills/active');
      const data = await response.json();
      setActiveSkills(data);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch active skills. Please try again.',
        confirmButtonColor: '#dc2626',
        customClass: {
          popup: 'rounded-md shadow-lg',
          title: 'text-lg font-semibold text-gray-800',
          content: 'text-gray-600',
          confirmButton: 'px-3 py-1.5 text-white font-medium rounded-md',
        },
      });
      console.error('Error fetching active skills:', error);
    }
  };

  useEffect(() => {
    fetchSkills();
    fetchActiveSkills();
  }, []);

  // Handle adding a new skill
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newSkill.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: 'Please enter a valid skill name.',
        confirmButtonColor: '#dc2626',
        customClass: {
          popup: 'rounded-md shadow-lg',
          title: 'text-lg font-semibold text-gray-800',
          content: 'text-gray-600',
          confirmButton: 'px-3 py-1.5 text-white font-medium rounded-md',
        },
      });
      return;
    }

    const newSkillData = {
      skill_name: newSkill.trim(),
      skill_status: 0, // Default status (inactive)
    };

    try {
      const res = await fetch('https://gig.kggeniuslabs.com/apiapi/test/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSkillData),
      });

      if (res.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Skill added successfully!',
          confirmButtonColor: '#dc2626',
          customClass: {
            popup: 'rounded-md shadow-lg',
            title: 'text-lg font-semibold text-gray-800',
            content: 'text-gray-600',
            confirmButton: 'px-3 py-1.5 text-white font-medium rounded-md',
          },
        });
        setNewSkill('');
        setIsModalOpen(false);
        fetchSkills();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to add skill. Please try again.',
          confirmButtonColor: '#dc2626',
          customClass: {
            popup: 'rounded-md shadow-lg',
            title: 'text-lg font-semibold text-gray-800',
            content: 'text-gray-600',
            confirmButton: 'px-3 py-1.5 text-white font-medium rounded-md',
          },
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while adding the skill. Please try again.',
        confirmButtonColor: '#dc2626',
        customClass: {
          popup: 'rounded-md shadow-lg',
          title: 'text-lg font-semibold text-gray-800',
          content: 'text-gray-600',
          confirmButton: 'px-3 py-1.5 text-white font-medium rounded-md',
        },
      });
      console.error('Error adding skill:', error);
    }
  };

  // Handle editing a skill
  const handleEdit = (skill) => {
    setEditingSkill(skill.skill_id);
    setEditingSkillName(skill.skill_name);
    setOriginalSkillName(skill.skill_name); // Store original name
  };

  const handleUpdate = async (skillId) => {
    if (!editingSkillName.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: 'Skill name cannot be empty.',
        confirmButtonColor: '#dc2626',
        customClass: {
          popup: 'rounded-md shadow-lg',
          title: 'text-lg font-semibold text-gray-800',
          content: 'text-gray-600',
          confirmButton: 'px-3 py-1.5 text-white font-medium rounded-md',
        },
      });
      return;
    }

    const hasChanged = editingSkillName.trim() !== originalSkillName.trim();

    try {
      const res = await fetch(`https://gig.kggeniuslabs.com/apiapi/test/skills/${skillId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skill_name: editingSkillName.trim() }),
      });

      if (res.ok) {
        if (hasChanged) {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Skill updated successfully!',
            confirmButtonColor: '#dc2626',
            customClass: {
              popup: 'rounded-md shadow-lg',
              title: 'text-lg font-semibold text-gray-800',
              content: 'text-gray-600',
              confirmButton: 'px-3 py-1.5 text-white font-medium rounded-md',
            },
          });
        }
        setEditingSkill(null);
        setEditingSkillName('');
        setOriginalSkillName('');
        fetchSkills();
        fetchActiveSkills();
      } else {
        if (hasChanged) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to update skill. Please try again.',
            confirmButtonColor: '#dc2626',
            customClass: {
              popup: 'rounded-md shadow-lg',
              title: 'text-lg font-semibold text-gray-800',
              content: 'text-gray-600',
              confirmButton: 'px-3 py-1.5 text-white font-medium rounded-md',
            },
          });
        }
      }
    } catch (error) {
      if (hasChanged) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred while updating the skill. Please try again.',
          confirmButtonColor: '#dc2626',
          customClass: {
            popup: 'rounded-md shadow-lg',
            title: 'text-lg font-semibold text-gray-800',
            content: 'text-gray-600',
            confirmButton: 'px-3 py-1.5 text-white font-medium rounded-md',
          },
        });
      }
      console.error('Error updating skill:', error);
    }
  };

  // Handle deleting a skill
  const handleDelete = async (skillId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This action will permanently delete the skill.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'rounded-md shadow-lg',
        title: 'text-lg font-semibold text-gray-800',
        content: 'text-gray-600',
        confirmButton: 'px-3 py-1.5 text-white font-medium rounded-md',
        cancelButton: 'px-3 py-1.5 text-white font-medium rounded-md',
      },
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`https://gig.kggeniuslabs.com/apiapi/test/skills/${skillId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Skill deleted successfully!',
          confirmButtonColor: '#dc2626',
          customClass: {
            popup: 'rounded-md shadow-lg',
            title: 'text-lg font-semibold text-gray-800',
            content: 'text-gray-600',
            confirmButton: 'px-3 py-1.5 text-white font-medium rounded-md',
          },
        });
        fetchSkills();
        fetchActiveSkills();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Cannot delete skill. Tests have been created for this skill.',
          confirmButtonColor: '#dc2626',
          customClass: {
            popup: 'rounded-md shadow-lg',
            title: 'text-lg font-semibold text-gray-800',
            content: 'text-gray-600',
            confirmButton: 'px-3 py-1.5 text-white font-medium rounded-md',
          },
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while deleting the skill. Please try again.',
        confirmButtonColor: '#dc2626',
        customClass: {
          popup: 'rounded-md shadow-lg',
          title: 'text-lg font-semibold text-gray-800',
          content: 'text-gray-600',
          confirmButton: 'px-3 py-1.5 text-white font-medium rounded-md',
        },
      });
      console.error('Error deleting skill:', error);
    }
  };

  // Filter skills by name
  const filteredAdminSkills = skills.filter((skill) =>
    skill.skill_name.toLowerCase().includes(adminFilter.toLowerCase())
  );
  const filteredStudentSkills = activeSkills.filter((skill) =>
    skill.skill_name.toLowerCase().includes(studentFilter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-blue-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-800 text-center mb-6">Skills</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Added by Admin (Inactive Skills) */}
          <div className="bg-white shadow-md rounded-md border border-blue-100">
            <div className="px-4 py-3 bg-blue-100 text-blue-800 border-b border-blue-200 flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="p-2 text-blue-600 hover:text-blue-800 focus:outline-none rounded-full bg-blue-200 hover:bg-blue-300 transition duration-200"
                  title="Add New Skill"
                >
                  <Plus className="h-5 w-5" />
                </button>
                <h2 className="text-md font-semibold">Added by Admin</h2>
              </div>
              <div className="relative w-48">
                <input
                  type="text"
                  value={adminFilter}
                  onChange={(e) => setAdminFilter(e.target.value)}
                  placeholder="Filter skills..."
                  className="w-full pl-8 pr-3 py-1.5 border border-blue-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-2 top-2 h-4 w-4 text-blue-500" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead className="bg-blue-50 text-blue-700 text-sm">
                  <tr>
                    <th className="p-3 text-left font-medium">S.No</th>
                    <th className="p-3 text-left font-medium">Skill Name</th>
                    <th className="p-3 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAdminSkills.length > 0 ? (
                    filteredAdminSkills.map((skill, index) => (
                      <tr key={skill.skill_id} className="hover:bg-blue-50 transition duration-150">
                        <td className="p-3 border-b border-blue-100 text-sm">{index + 1}</td>
                        <td className="p-3 border-b border-blue-100 text-sm">
                          {editingSkill === skill.skill_id ? (
                            <input
                              type="text"
                              value={editingSkillName}
                              onChange={(e) => setEditingSkillName(e.target.value)}
                              className="w-full border border-blue-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          ) : (
                            skill.skill_name
                          )}
                        </td>
                        <td className="p-3 border-b border-blue-100 flex space-x-2">
                          {editingSkill === skill.skill_id ? (
                            <>
                              <button
                                onClick={() => handleUpdate(skill.skill_id)}
                                className={`p-1.5 ${
                                  editingSkillName.trim() !== skill.skill_name.trim()
                                    ? 'text-green-600 hover:text-green-800'
                                    : 'text-blue-600 hover:text-blue-800'
                                } focus:outline-none`}
                              >
                                {editingSkillName.trim() !== skill.skill_name.trim() ? (
                                  <Check className="h-4 w-4" />
                                ) : (
                                  <Pencil className="h-4 w-4" />
                                )}
                              </button>
                              <button
                                onClick={() => setEditingSkill(null)}
                                className="p-1.5 text-gray-600 hover:text-gray-800 focus:outline-none"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEdit(skill)}
                                className="p-1.5 text-blue-600 hover:text-blue-800 focus:outline-none"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(skill.skill_id)}
                                className="p-1.5 text-red-600 hover:text-red-800 focus:outline-none"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="p-4 text-center text-gray-500 text-sm">
                        No inactive skills found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Added by Student (Active Skills) */}
          <div className="bg-white shadow-md rounded-md border border-blue-100">
            <div className="px-4 py-3 bg-blue-100 text-blue-800 border-b border-blue-200 flex justify-between items-center">
              <h2 className="text-md font-semibold">Added by Student (custom skill)</h2>
              <div className="relative w-48">
                <input
                  type="text"
                  value={studentFilter}
                  onChange={(e) => setStudentFilter(e.target.value)}
                  placeholder="Filter skills..."
                  className="w-full pl-8 pr-3 py-1.5 border border-blue-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-2 top-2 h-4 w-4 text-blue-500" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead className="bg-blue-50 text-blue-700 text-sm">
                  <tr>
                    <th className="p-3 text-left font-medium">S.No</th>
                    <th className="p-3 text-left font-medium">Skill Name</th>
                    <th className="p-3 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudentSkills.length > 0 ? (
                    filteredStudentSkills.map((skill, index) => (
                      <tr key={skill.skill_id} className="hover:bg-blue-50 transition duration-150">
                        <td className="p-3 border-b border-blue-100 text-sm">{index + 1}</td>
                        <td className="p-3 border-b border-blue-100 text-sm">
                          {editingSkill === skill.skill_id ? (
                            <input
                              type="text"
                              value={editingSkillName}
                              onChange={(e) => setEditingSkillName(e.target.value)}
                              className="w-full border border-blue-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          ) : (
                            skill.skill_name
                          )}
                        </td>
                        <td className="p-3 border-b border-blue-100 flex space-x-2">
                          {editingSkill === skill.skill_id ? (
                            <>
                              <button
                                onClick={() => handleUpdate(skill.skill_id)}
                                className={`p-1.5 ${
                                  editingSkillName.trim() !== skill.skill_name.trim()
                                    ? 'text-green-600 hover:text-green-800'
                                    : 'text-blue-600 hover:text-blue-800'
                                } focus:outline-none`}
                              >
                                {editingSkillName.trim() !== skill.skill_name.trim() ? (
                                  <Check className="h-4 w-4" />
                                ) : (
                                  <Pencil className="h-4 w-4" />
                                )}
                              </button>
                              <button
                                onClick={() => setEditingSkill(null)}
                                className="p-1.5 text-gray-600 hover:text-gray-800 focus:outline-none"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEdit(skill)}
                                className="p-1.5 text-blue-600 hover:text-blue-800 focus:outline-none"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(skill.skill_id)}
                                className="p-1.5 text-red-600 hover:text-red-800 focus:outline-none"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="p-4 text-center text-gray-500 text-sm">
                        No active skills found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal for Adding Skill */}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          className="max-w-lg mx-auto mt-20 bg-white/80 rounded-lg shadow-lg p-6 backdrop-blur-md"
          overlayClassName="fixed inset-0 bg-gray-100/50 backdrop-blur-md flex items-center justify-center"
        >
          <div className="relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-0 right-0 p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-semibold text-blue-800 mb-4">Add New Skill</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="e.g. JavaScript"
                  className="w-full border border-blue-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="text-right">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 text-sm"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default Addskill;












































// import React, { useEffect, useState } from 'react';
// import Swal from 'sweetalert2';
// import { Pencil, Trash2, Search, Check, Plus, X } from 'lucide-react';
// import Modal from 'react-modal';
// import { useParams, useNavigate } from 'react-router-dom'; // Added imports

// // Bind modal to app element for accessibility
// Modal.setAppElement('#root');

// function Addskill() {
//   const { id } = useParams(); // Get the id from URL
//   const navigate = useNavigate(); // For redirecting if id is invalid
//   const [skills, setSkills] = useState([]);
//   const [activeSkills, setActiveSkills] = useState([]);
//   const [newSkill, setNewSkill] = useState('');
//   const [editingSkill, setEditingSkill] = useState(null);
//   const [editingSkillName, setEditingSkillName] = useState('');
//   const [originalSkillName, setOriginalSkillName] = useState(''); // Store original skill name
//   const [adminFilter, setAdminFilter] = useState('');
//   const [studentFilter, setStudentFilter] = useState('');
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   // Decode the id
//   let decodedId;
//   try {
//     decodedId = id ? atob(id) : null; // Decode Base64-encoded id
//   } catch (e) {
//     console.error('Failed to decode student ID:', e);
//     decodedId = null;
//   }

//   // Redirect to login if id is invalid
//   useEffect(() => {
//     if (!decodedId) {
//       Swal.fire({
//         icon: 'error',
//         title: 'Error',
//         text: 'Invalid user ID. Please log in again.',
//         confirmButtonColor: '#dc2626',
//         customClass: {
//           popup: 'rounded-md shadow-lg',
//           title: 'text-lg font-semibold text-gray-800',
//           content: 'text-gray-600',
//           confirmButton: 'px-3 py-1.5 text-white font-medium rounded-md',
//         },
//       }).then(() => navigate('/login'));
//     }
//   }, [decodedId, navigate]);

//   // Fetch all skills (inactive only for admin table)
//   const fetchSkills = async () => {
//     try {
//       const response = await fetch('https://gig.kggeniuslabs.com/apiapi/test/skills', {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // Include token
//           'X-Admin-ID': decodedId, // Pass admin ID for validation
//         },
//       });
//       const data = await response.json();
//       setSkills(data.filter((skill) => skill.skill_status === 0)); // Only inactive skills
//     } catch (error) {
//       Swal.fire({
//         icon: 'error',
//         title: 'Error',
//         text: 'Failed to fetch skills. Please try again.',
//         confirmButtonColor: '#dc2626',
//         customClass: {
//           popup: 'rounded-md shadow-lg',
//           title: 'text-lg font-semibold text-gray-800',
//           content: 'text-gray-600',
//           confirmButton: 'px-3 py-1.5 text-white font-medium rounded-md',
//         },
//       });
//       console.error('Error fetching skills:', error);
//     }
//   };

//   // Fetch active skills (skill_status = 1)
//   const fetchActiveSkills = async () => {
//     try {
//       const response = await fetch('https://gig.kggeniuslabs.com/apiapi/test/skills/active', {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // Include token
//           'X-Admin-ID': decodedId, // Pass admin ID for validation
//         },
//       });
//       const data = await response.json();
//       setActiveSkills(data);
//     } catch (error) {
//       Swal.fire({
//         icon: 'error',
//         title: 'Error',
//         text: 'Failed to fetch active skills. Please try again.',
//         confirmButtonColor: '#dc2626',
//         customClass: {
//           popup: 'rounded-md shadow-lg',
//           title: 'text-lg font-semibold text-gray-800',
//           content: 'text-gray-600',
//           confirmButton: 'px-3 py-1.5 text-white font-medium rounded-md',
//         },
//       });
//       console.error('Error fetching active skills:', error);
//     }
//   };

//   useEffect(() => {
//     if (decodedId) {
//       fetchSkills();
//       fetchActiveSkills();
//     }
//   }, [decodedId]); // Added decodedId as dependency

//   // Handle adding a new skill
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!newSkill.trim()) {
//       Swal.fire({
//         icon: 'warning',
//         title: 'Warning',
//         text: 'Please enter a valid skill name.',
//         confirmButtonColor: '#dc2626',
//         customClass: {
//           popup: 'rounded-md shadow-lg',
//           title: 'text-lg font-semibold text-gray-800',
//           content: 'text-gray-600',
//           confirmButton: 'px-3 py-1.5 text-white font-medium rounded-md',
//         },
//       });
//       return;
//     }

//     const newSkillData = {
//       skill_name: newSkill.trim(),
//       skill_status: 0, // Default status (inactive)
//     };

//     try {
//       const res = await fetch('https://gig.kggeniuslabs.com/apiapi/test/skills', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // Include token
//           'X-Admin-ID': decodedId, // Pass admin ID for validation
//         },
//         body: JSON.stringify(newSkillData),
//       });

//       if (res.ok) {
//         Swal.fire({
//           icon: 'success',
//           title: 'Success',
//           text: 'Skill added successfully!',
//           confirmButtonColor: '#dc2626',
//           customClass: {
//             popup: 'rounded-md shadow-lg',
//             title: 'text-lg font-semibold text-gray-800',
//             content: 'text-gray-600',
//             confirmButton: 'px-3 py-1.5 text-white font-medium rounded-md',
//           },
//         });
//         setNewSkill('');
//         setIsModalOpen(false);
//         fetchSkills();
//       } else {
//         Swal.fire({
//           icon: 'error',
//           title: 'Error',
//           text: 'Failed to add skill. Please try again.',
//           confirmButtonColor: '#dc2626',
//           customClass: {
//             popup: 'rounded-md shadow-lg',
//             title: 'text-lg font-semibold text-gray-800',
//             content: 'text-gray-600',
//             confirmButton: 'px-3 py-1.5 text-white font-medium rounded-md',
//           },
//         });
//       }
//     } catch (error) {
//       Swal.fire({
//         icon: 'error',
//         title: 'Error',
//         text: 'An error occurred while adding the skill. Please try again.',
//         confirmButtonColor: '#dc2626',
//         customClass: {
//           popup: 'rounded-md shadow-lg',
//           title: 'text-lg font-semibold text-gray-800',
//           content: 'text-gray-600',
//           confirmButton: 'px-3 py-1.5 text-white font-medium rounded-md',
//         },
//       });
//       console.error('Error adding skill:', error);
//     }
//   };

//   // Handle editing a skill
//   const handleEdit = (skill) => {
//     setEditingSkill(skill.skill_id);
//     setEditingSkillName(skill.skill_name);
//     setOriginalSkillName(skill.skill_name); // Store original name
//   };

//   const handleUpdate = async (skillId) => {
//     if (!editingSkillName.trim()) {
//       Swal.fire({
//         icon: 'warning',
//         title: 'Warning',
//         text: 'Skill name cannot be empty.',
//         confirmButtonColor: '#dc2626',
//         customClass: {
//           popup: 'rounded-md shadow-lg',
//           title: 'text-lg font-semibold text-gray-800',
//           content: 'text-gray-600',
//           confirmButton: 'px-3 py-1.5 text-white font-medium rounded-md',
//         },
//       });
//       return;
//     }

//     const hasChanged = editingSkillName.trim() !== originalSkillName.trim();

//     try {
//       const res = await fetch(`https://gig.kggeniuslabs.com/apiapi/test/skills/${skillId}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // Include token
//           'X-Admin-ID': decodedId, // Pass admin ID for validation
//         },
//         body: JSON.stringify({ skill_name: editingSkillName.trim() }),
//       });

//       if (res.ok) {
//         if (hasChanged) {
//           Swal.fire({
//             icon: 'success',
//             title: 'Success',
//             text: 'Skill updated successfully!',
//             confirmButtonColor: '#dc2626',
//             customClass: {
//               popup: 'rounded-md shadow-lg',
//               title: 'text-lg font-semibold text-gray-800',
//               content: 'text-gray-600',
//               confirmButton: 'px-3 py-1.5 text-white font-medium rounded-md',
//             },
//           });
//         }
//         setEditingSkill(null);
//         setEditingSkillName('');
//         setOriginalSkillName('');
//         fetchSkills();
//         fetchActiveSkills();
//       } else {
//         if (hasChanged) {
//           Swal.fire({
//             icon: 'error',
//             title: 'Error',
//             text: 'Failed to update skill. Please try again.',
//             confirmButtonColor: '#dc2626',
//             customClass: {
//               popup: 'rounded-md shadow-lg',
//               title: 'text-lg font-semibold text-gray-800',
//               content: 'text-gray-600',
//               confirmButton: 'px-3 py-1.5 text-white font-medium rounded-md',
//             },
//           });
//         }
//       }
//     } catch (error) {
//       if (hasChanged) {
//         Swal.fire({
//           icon: 'error',
//           title: 'Error',
//           text: 'An error occurred while updating the skill. Please try again.',
//           confirmButtonColor: '#dc2626',
//           customClass: {
//             popup: 'rounded-md shadow-lg',
//             title: 'text-lg font-semibold text-gray-800',
//             content: 'text-gray-600',
//             confirmButton: 'px-3 py-1.5 text-white font-medium rounded-md',
//           },
//         });
//       }
//       console.error('Error updating skill:', error);
//     }
//   };

//   // Handle deleting a skill
//   const handleDelete = async (skillId) => {
//     const result = await Swal.fire({
//       title: 'Are you sure?',
//       text: 'This action will permanently delete the skill.',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#dc2626',
//       cancelButtonColor: '#6b7280',
//       confirmButtonText: 'Yes, delete it!',
//       cancelButtonText: 'Cancel',
//       customClass: {
//         popup: 'rounded-md shadow-lg',
//         title: 'text-lg font-semibold text-gray-800',
//         content: 'text-gray-600',
//         confirmButton: 'px-3 py-1.5 text-white font-medium rounded-md',
//         cancelButton: 'px-3 py-1.5 text-white font-medium rounded-md',
//       },
//     });

//     if (!result.isConfirmed) return;

//     try {
//       const res = await fetch(`https://gig.kggeniuslabs.com/apiapi/test/skills/${skillId}`, {
//         method: 'DELETE',
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // Include token
//           'X-Admin-ID': decodedId, // Pass admin ID for validation
//         },
//       });

//       if (res.ok) {
//         Swal.fire({
//           icon: 'success',
//           title: 'Success',
//           text: 'Skill deleted successfully!',
//           confirmButtonColor: '#dc2626',
//           customClass: {
//             popup: 'rounded-md shadow-lg',
//             title: 'text-lg font-semibold text-gray-800',
//             content: 'text-gray-600',
//             confirmButton: 'px-3 py-1.5 text-white font-medium rounded-md',
//           },
//         });
//         fetchSkills();
//         fetchActiveSkills();
//       } else {
//         Swal.fire({
//           icon: 'error',
//           title: 'Error',
//           text: 'Cannot delete skill. Tests have been created for this skill.',
//           confirmButtonColor: '#dc2626',
//           customClass: {
//             popup: 'rounded-md shadow-lg',
//             title: 'text-lg font-semibold text-gray-800',
//             content: 'text-gray-600',
//             confirmButton: 'px-3 py-1.5 text-white font-medium rounded-md',
//           },
//         });
//       }
//     } catch (error) {
//       Swal.fire({
//         icon: 'error',
//         title: 'Error',
//         text: 'An error occurred while deleting the skill. Please try again.',
//         confirmButtonColor: '#dc2626',
//         customClass: {
//           popup: 'rounded-md shadow-lg',
//           title: 'text-lg font-semibold text-gray-800',
//           content: 'text-gray-600',
//           confirmButton: 'px-3 py-1.5 text-white font-medium rounded-md',
//         },
//       });
//       console.error('Error deleting skill:', error);
//     }
//   };

//   // Filter skills by name
//   const filteredAdminSkills = skills.filter((skill) =>
//     skill.skill_name.toLowerCase().includes(adminFilter.toLowerCase())
//   );
//   const filteredStudentSkills = activeSkills.filter((skill) =>
//     skill.skill_name.toLowerCase().includes(studentFilter.toLowerCase())
//   );

//   return (
//     <div className="min-h-screen bg-blue-50 py-6 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-5xl mx-auto">
//         <h1 className="text-2xl font-bold text-blue-800 text-center mb-6">Skills</h1>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {/* Added by Admin (Inactive Skills) */}
//           <div className="bg-white shadow-md rounded-md border border-blue-100">
//             <div className="px-4 py-3 bg-blue-100 text-blue-800 border-b border-blue-200 flex justify-between items-center">
//               <div className="flex items-center space-x-4">
//                 <button
//                   onClick={() => setIsModalOpen(true)}
//                   className="p-2 text-blue-600 hover:text-blue-800 focus:outline-none rounded-full bg-blue-200 hover:bg-blue-300 transition duration-200"
//                   title="Add New Skill"
//                 >
//                   <Plus className="h-5 w-5" />
//                 </button>
//                 <h2 className="text-md font-semibold">Added by Admin</h2>
//               </div>
//               <div className="relative w-48">
//                 <input
//                   type="text"
//                   value={adminFilter}
//                   onChange={(e) => setAdminFilter(e.target.value)}
//                   placeholder="Filter skills..."
//                   className="w-full pl-8 pr-3 py-1.5 border border-blue-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                 <Search className="absolute left-2 top-2 h-4 w-4 text-blue-500" />
//               </div>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="w-full table-auto">
//                 <thead className="bg-blue-50 text-blue-700 text-sm">
//                   <tr>
//                     <th className="p-3 text-left font-medium">S.No</th>
//                     <th className="p-3 text-left font-medium">Skill Name</th>
//                     <th className="p-3 text-left font-medium">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredAdminSkills.length > 0 ? (
//                     filteredAdminSkills.map((skill, index) => (
//                       <tr key={skill.skill_id} className="hover:bg-blue-50 transition duration-150">
//                         <td className="p-3 border-b border-blue-100 text-sm">{index + 1}</td>
//                         <td className="p-3 border-b border-blue-100 text-sm">
//                           {editingSkill === skill.skill_id ? (
//                             <input
//                               type="text"
//                               value={editingSkillName}
//                               onChange={(e) => setEditingSkillName(e.target.value)}
//                               className="w-full border border-blue-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             />
//                           ) : (
//                             skill.skill_name
//                           )}
//                         </td>
//                         <td className="p-3 border-b border-blue-100 flex space-x-2">
//                           {editingSkill === skill.skill_id ? (
//                             <>
//                               <button
//                                 onClick={() => handleUpdate(skill.skill_id)}
//                                 className={`p-1.5 ${
//                                   editingSkillName.trim() !== skill.skill_name.trim()
//                                     ? 'text-green-600 hover:text-green-800'
//                                     : 'text-blue-600 hover:text-blue-800'
//                                 } focus:outline-none`}
//                               >
//                                 {editingSkillName.trim() !== skill.skill_name.trim() ? (
//                                   <Check className="h-4 w-4" />
//                                 ) : (
//                                   <Pencil className="h-4 w-4" />
//                                 )}
//                               </button>
//                               <button
//                                 onClick={() => setEditingSkill(null)}
//                                 className="p-1.5 text-gray-600 hover:text-gray-800 focus:outline-none"
//                               >
//                                 <Trash2 className="h-4 w-4" />
//                               </button>
//                             </>
//                           ) : (
//                             <>
//                               <button
//                                 onClick={() => handleEdit(skill)}
//                                 className="p-1.5 text-blue-600 hover:text-blue-800 focus:outline-none"
//                               >
//                                 <Pencil className="h-4 w-4" />
//                               </button>
//                               <button
//                                 onClick={() => handleDelete(skill.skill_id)}
//                                 className="p-1.5 text-red-600 hover:text-red-800 focus:outline-none"
//                               >
//                                 <Trash2 className="h-4 w-4" />
//                               </button>
//                             </>
//                           )}
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="3" className="p-4 text-center text-gray-500 text-sm">
//                         No inactive skills found.
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Added by Student (Active Skills) */}
//           <div className="bg-white shadow-md rounded-md border border-blue-100">
//             <div className="px-4 py-3 bg-blue-100airport text-blue-800 border-b border-blue-200 flex justify-between items-center">
//               <h2 className="text-md font-semibold">Added by Student (custom skill)</h2>
//               <div className="relative w-48">
//                 <input
//                   type="text"
//                   value={studentFilter}
//                   onChange={(e) => setStudentFilter(e.target.value)}
//                   placeholder="Filter skills..."
//                   className="w-full pl-8 pr-3 py-1.5 border border-blue-300 rounded-md text-sm focus:outline-none"
//                 />
//                 <Search className="absolute left-2 top-2 hgesi4 w-4 text-blue-400" />
//               </div>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="w-full table-auto">
//                 <thead className="bg-blue-50 text-blue-700 text-sm">
//                   <tr>
//                     <th className="p-3 text-left font-medium">S.No</th>
//                     <th className="p-3 text-left font-medium">Skill Name</th>
//                     <th className="p-3 text-left font-medium">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredStudentSkills.length > 0 ? (
//                     filteredStudentSkills.map((skill, index) => (
//                       <tr key={skill.skill_id} className="hover:bg-blue-50 transition duration-150">
//                         <td className="p-3 border-b border-blue-100 text-sm">{index + 1}</td>
//                         <td className="p-3 border-b border-blue-100 text-sm">
//                           {editingSkill === skill.skill_id ? (
//                             <input
//                               type="text"
//                               value={editingSkillName}
//                               onChange={(e) => setEditingSkillName(e.target.value)}
//                               className="w-full border border-blue-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             />
//                           ) : (
//                             skill.skill_name
//                           )}
//                         </td>
//                         <td className="p-3 border-b border-blue-100 flex space-x-2">
//                           {editingSkill === skill.skill_id ? (
//                             <>
//                               <button
//                                 onClick={() => handleUpdate(skill.skill_id)}
//                                 className={`p-1.5 ${
//                                   editingSkillName.trim() !== skill.skill_name.trim()
//                                     ? 'text-green-600 hover:text-green-800'
//                                     : 'text-blue-600 hover:text-blue-800'
//                                 } focus:outline-none`}
//                               >
//                                 {editingSkillName.trim() !== skill.skill_name.trim() ? (
//                                   <Check className="h-4 w-4" />
//                                 ) : (
//                                   <Pencil className="h-4 w-4" />
//                                 )}
//                               </button>
//                               <button
//                                 onClick={() => setEditingSkill(null)}
//                                 className="p-1.5 text-gray-600 hover:text-gray-800 focus:outline-none"
//                               >
//                                 <Trash2 className="h-4 w-4" />
//                               </button>
//                             </>
//                           ) : (
//                             <>
//                               <button
//                                 onClick={() => handleEdit(skill)}
//                                 className="p-1.5 text-blue-600 hover:text-blue-800 focus:outline-none"
//                               >
//                                 <Pencil className="h-4 w-4" />
//                               </button>
//                               <button
//                                 onClick={() => handleDelete(skill.skill_id)}
//                                 className="p-1.5 text-red-600 hover:text-red-800 focus:outline-none"
//                               >
//                                 <Trash2 className="h-4 w-4" />
//                               </button>
//                             </>
//                           )}
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="3" className="p-4 text-center text-gray-500 text-sm">
//                         No active skills found.
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>

//         {/* Modal for adding Skill */}
//         <Modal
//           isOpen={isModalOpen}
//           onRequestClose={() => setIsModalOpen(false)}
//           className="max-w-lg mx-auto mt-20 bg-white/80 rounded-lg shadow-lg p-6 backdrop-blur-md"
//           overlayClassName="fixed inset-0 bg-gray-100/50 backdrop-blur-md"
//         >
//           <div className="relative">
//             <button
//               onClick={() => setIsModalOpen(false)}
//               className="absolute top-0 right-0-2 text-blue-600 hover:bg-blue-300 focus:outline-none"
//             >
//               <X className="h-5 w-5" />
//             </button>
//             <h2 className="text-lg font-semibold text-blue-800 mb-4">Add New Skill</h2>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <input
//                   type="text"
//                   value={newSkill}
//                   onChange={(e) => setNewSkill(e.target.value)}
//                   placeholder="e.g. Python"
//                   className="w-full border border-blue-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//               <div className="text-right">
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
//                 >
//                   Add
//                 </button>
//               </div>
//             </form>
//           </div>
//         </Modal>
//       </div>
//     </div>
//   );
// }

// export default Addskill;