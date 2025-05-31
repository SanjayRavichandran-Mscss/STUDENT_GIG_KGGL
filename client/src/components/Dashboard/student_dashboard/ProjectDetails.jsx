import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ProjectDetails() {
  const { id, proid, credits } = useParams();
  const decoded = atob(id); // Student ID
  const decodedProject = atob(proid); // Project ID
  const decodedCredits = atob(credits); // Credits
  console.log("Decoded Credits:", decodedCredits); // For debugging

  const [projectDetails, setProjectDetails] = useState([]);
  const [hasBidded, setHasBidded] = useState(false);
  const [bitStatus, setBitStatus] = useState(null); // Latest bid status
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setIsLoading(true);
        // Fetch project details
        const projectResponse = await axios.get(
          `http://localhost:5000/api/stu/prodeatil/${decodedProject}`
        );
        setProjectDetails(
          projectResponse.data.map((project) => ({
            ...project,
            formatted_expiry_date: formatExpiryDate(project.expiry_date),
          }))
        );

        // Check if student has bidded and get latest bid status
        const bidResponse = await axios.get(
          `http://localhost:5000/api/admin/checkBid/${decoded}/${decodedProject}`
        );
        setHasBidded(bidResponse.data.hasBidded);
        setBitStatus(bidResponse.data.bitStatus); // Store latest bid status
      } catch (err) {
        console.error("Error fetching project details or bid status:", err);
        setError("Failed to load project details or bid status. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectDetails();
  }, [decodedProject, decoded]);

  const formatExpiryDate = (expiryDate) => {
    const date = new Date(expiryDate);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleClick = async (stu_id, pro_id, credits) => {
    let updatedCredits = credits - 1; // Decrease credits by 1
    try {
      setIsSubmitting(true);
      const response = await axios.post(
        `http://localhost:5000/api/admin/bitinfo`,
        {
          stu_id,
          pro_id,
        }
      );

      if (response.data === "bit_added") {
        toast.success("Request sent successfully");
        setHasBidded(true);
        setBitStatus("pending"); // Set status to pending after placing bid
      }

      const updateCreditsResponse = await axios.put(
        `http://localhost:5000/api/stu/updateBidCredits/${decoded}`,
        {
          bid_credits: updatedCredits,
        }
      );
      if (updateCreditsResponse.status === "credits_updated") {
        toast.success("Bid credits updated successfully");
      }
    } catch (err) {
      console.error("Error submitting bid:", err);
      toast.error("Failed to submit bid. Please try again.");
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
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-3xl font-bold text-center mb-8">Project Details</h1>

      {projectDetails.map((val, ind) => (
        <div
          key={ind}
          className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden mb-8"
        >
          <div className="p-8">
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

              <div className="pt-4 flex items-center space-x-3">
                {hasBidded ? (
                  <>
                    <span className="inline-block bg-green-100 text-green-800 px-6 py-2 rounded-md text-sm font-medium">
                      Bid Submitted
                    </span>
                    {bitStatus && (
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          bitStatus === "accepted" || bitStatus === "inprogress" || bitStatus === "completed" || bitStatus === "client_approved" || bitStatus === "payment_received"
                            ? "bg-green-100 text-green-800"
                            : bitStatus === "declined"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {bitStatus.charAt(0).toUpperCase() + bitStatus.slice(1)}
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    {decodedCredits > 0 ? (
                      <button
                        onClick={() => handleClick(decoded, val.project_id, decodedCredits)}
                        disabled={isSubmitting}
                        className={`px-6 py-2 rounded-md text-white font-medium ${
                          isSubmitting
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-indigo-600 hover:bg-indigo-700"
                        } transition duration-200`}
                      >
                        {isSubmitting ? "Submitting..." : "Place Bid"}
                      </button>
                    ) : (
                      <span className="inline-block bg-red-100 text-red-800 px-6 py-2 rounded-md text-sm font-medium">
                        No Bid Credits Available
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProjectDetails;