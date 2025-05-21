import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function TransactionDetails() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("http://localhost:5000/api/quiz/transactions");
        setTransactions(response.data.result);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError("Failed to load transaction details. Please try again.");
        toast.error("Failed to load transaction details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-blue-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-blue-50">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-blue-50 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar closeOnClick theme="light" />
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-800">Transaction Details</h1>

      {transactions.length === 0 ? (
        <div className="text-center text-blue-600 text-lg">
          No transaction details found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {transactions.map((transaction, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden border border-blue-200 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold text-blue-700 mb-4">{transaction.project_name}</h2>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-blue-600">Student Name:</span>
                    <p className="text-blue-800">{transaction.student_name}</p>
                  </div>
                  <div>
                    <span className="font-medium text-blue-600">From Account:</span>
                    <p className="text-blue-800">{transaction.from_account_number}</p>
                  </div>
                  <div>
                    <span className="font-medium text-blue-600">To Account:</span>
                    <p className="text-blue-800">{transaction.to_account_number}</p>
                  </div>
                  <div>
                    <span className="font-medium text-blue-600">Transaction ID:</span>
                    <p className="text-blue-800">{transaction.transaction_id}</p>
                  </div>
                  <div>
                    <span className="font-medium text-blue-600">Screenshot:</span>
                    {transaction.transaction_screenshot ? (
                      <a
                        href={`http://localhost:5000/${transaction.transaction_screenshot}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block mt-2 text-blue-600 underline hover:text-blue-800 transition-colors"
                      >
                        View Transaction Screenshot
                      </a>
                    ) : (
                      <p className="text-blue-600 italic">No screenshot available</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TransactionDetails;