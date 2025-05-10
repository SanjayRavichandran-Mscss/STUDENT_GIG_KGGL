import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ProjectDetails() {
  const { id, proid } = useParams();
  const decoded = atob(id);
  const decodedProject = atob(proid);

  const [projectDetails, setProjectDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:5000/stu/prodeatil/${decodedProject}`);
        
        setProjectDetails(
          response.data.map((project) => ({
            ...project,
            formatted_expiry_date: formatExpiryDate(project.expiry_date),
          }))
        );
      } catch (err) {
        console.error("Error fetching project details:", err);
        setError("Failed to load project details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectDetails();
  }, [decodedProject]);

  const formatExpiryDate = (expiryDate) => {
    const date = new Date(expiryDate);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  const handleClick = async (stu_id, pro_id) => {
    try {
      setIsSubmitting(true);
      const response = await axios.post(`http://localhost:5000/admin/bitinfo`, {
        stu_id,
        pro_id
      });

      if (response.data === "bit_added") {
        alert("Request sent successfully");
      }
    } catch (err) {
      console.error("Error submitting bid:", err);
      alert("Failed to submit bid. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Project Details</h1>
      
      {projectDetails.map((val, ind) => (
        <div key={ind} className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mb-1">
              Project ID: {val.project_id}
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{val.project_name}</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-700">Description</h3>
                <p className="text-gray-600">{val.project_description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-700">Expiry Date</h3>
                  <p className="text-gray-600">{val.formatted_expiry_date}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-700">Required Skill</h3>
                  <p className="text-gray-600">{val.skill_name}</p>
                </div>
              </div>
              
              <div className="pt-4">
                <button
                  onClick={() => handleClick(decoded, val.project_id)}
                  disabled={isSubmitting}
                  className={`px-6 py-2 rounded-md text-white font-medium ${
                    isSubmitting 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  } transition duration-200`}
                >
                  {isSubmitting ? 'Submitting...' : 'Place Bid'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProjectDetails;