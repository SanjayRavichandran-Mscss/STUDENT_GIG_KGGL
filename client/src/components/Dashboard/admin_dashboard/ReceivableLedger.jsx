import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { CreditCard, X, Download, FileText, User, Calendar, ArrowUpDown, Wallet, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MySwal = withReactContent(Swal);

// Utility function to format date to MySQL DATETIME format
const formatDateForMySQL = (date) => {
  const pad = (num) => String(num).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

const ReceivableLedger = () => {
  const { id } = useParams();
  const [createdBy, setCreatedBy] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [balanceAmount, setBalanceAmount] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    projectId: '',
    projectName: '',
    clientName: '',
    paidAmount: '',
    fromUpiId: '',
    toUpiId: '',
    transactionId: '',
    dateTime: new Date(),
    transactionScreenshot: null,
  });

  // Decode URL ID
  useEffect(() => {
    try {
      if (!id) throw new Error('No ID provided in the URL.');
      const decodedId = atob(id);
      const parsedId = parseInt(decodedId, 10);
      if (isNaN(parsedId)) throw new Error('Decoded ID is not a valid integer.');
      setCreatedBy(parsedId);
    } catch (error) {
      console.error('Error decoding ID:', error.message);
      MySwal.fire({
        icon: 'error',
        title: 'Invalid ID',
        text: 'The ID in the URL is invalid or not properly encoded.',
      });
      setCreatedBy(null);
    }
  }, [id]);

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/getallprojects');
        setProjects(response.data);
        
        // Set the last project as default selected
        if (response.data.length > 0) {
          const lastProject = response.data[response.data.length - 1];
          handleProjectSelect(lastProject);
        }
      } catch (error) {
        console.error('Error fetching projects:', error.message);
        MySwal.fire({
          icon: 'error',
          title: 'Fetch Error',
          text: 'Failed to fetch projects.',
        });
      }
    };
    fetchProjects();
  }, []);

  // Fetch transaction history
  useEffect(() => {
    if (createdBy === null) return;

    const fetchData = async () => {
      try {
        const historyResponse = await axios.get('http://localhost:5000/api/admin/receivable-ledger-history');
        if (historyResponse.data.status) {
          setTransactions(historyResponse.data.result);
          updateProjectSummary();
        } else {
          throw new Error(historyResponse.data.msg || 'Failed to fetch transaction history');
        }
      } catch (error) {
        console.error('Error fetching transaction history:', error.message);
        MySwal.fire({
          icon: 'error',
          title: 'Fetch Error',
          text: 'Failed to fetch transaction history.',
        });
      }
    };

    fetchData();
  }, [createdBy, formData.projectName]);

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    setFormData(prev => ({
      ...prev,
      projectId: project.project_id,
      projectName: project.project_name
    }));
    updateProjectSummary(project.project_name);
  };

  const updateProjectSummary = (projectName = selectedProject?.project_name) => {
    if (!projectName) return;
    
    const project = projects.find(p => p.project_name === projectName);
    if (!project) return;

    const projectTransactions = transactions.filter(t => t.project_name === projectName);
    const paid = projectTransactions.reduce((sum, t) => sum + parseFloat(t.paid_amount), 0);
    
    setTotalPaid(paid);
    setBalanceAmount(parseFloat(project.total_amount) - paid);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'projectId' && {
        projectName: projects.find(p => p.project_id === parseInt(value))?.project_name || '',
      }),
    }));

    if (name === 'projectId' && value) {
      const selected = projects.find(p => p.project_id === parseInt(value));
      if (selected) {
        handleProjectSelect(selected);
      }
    }
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      dateTime: date,
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      transactionScreenshot: e.target.files[0],
    }));
  };

  const validateForm = () => {
    const { projectId, projectName, clientName, paidAmount, fromUpiId, toUpiId, transactionId, dateTime, transactionScreenshot } = formData;

    if (!projectId || !projectName || !clientName || !paidAmount || !fromUpiId || !toUpiId || !transactionId || !dateTime || !transactionScreenshot) {
      MySwal.fire({
        icon: 'error',
        title: 'Missing Fields',
        text: 'Please fill all required fields.',
      });
      return false;
    }

    if (parseFloat(paidAmount) <= 0) {
      MySwal.fire({
        icon: 'error',
        title: 'Invalid Amount',
        text: 'Paid amount must be greater than zero.',
      });
      return false;
    }

    if (selectedProject && parseFloat(paidAmount) > parseFloat(selectedProject.total_amount)) {
      MySwal.fire({
        icon: 'error',
        title: 'Invalid Paid Amount',
        text: `Paid amount (₹${paidAmount}) cannot exceed the project's total amount (₹${selectedProject.total_amount}).`,
      });
      return false;
    }

    if (parseFloat(paidAmount) > balanceAmount) {
      MySwal.fire({
        icon: 'error',
        title: 'Invalid Paid Amount',
        text: `Paid amount (₹${paidAmount}) cannot exceed the remaining balance (₹${balanceAmount.toFixed(2)}).`,
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (createdBy === null) {
      MySwal.fire({
        icon: 'error',
        title: 'Invalid ID',
        text: 'Cannot submit the form due to an invalid user ID.',
      });
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('project_id', formData.projectId);
      formDataToSend.append('client_name', formData.clientName);
      formDataToSend.append('paid_amount', formData.paidAmount);
      formDataToSend.append('from_upi_id', formData.fromUpiId);
      formDataToSend.append('to_upi_id', formData.toUpiId);
      formDataToSend.append('transaction_id', formData.transactionId);
      formDataToSend.append('date_time', formatDateForMySQL(formData.dateTime));
      formDataToSend.append('transaction_screenshot', formData.transactionScreenshot);
      formDataToSend.append('created_by', createdBy);

      const response = await axios.post(
        'http://localhost:5000/api/admin/save-receivable-ledger',
        formDataToSend,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (response.data.status) {
        MySwal.fire({
          icon: 'success',
          title: 'Transaction Added',
          text: 'Your receivable transaction has been successfully recorded!',
        });

        const historyResponse = await axios.get('http://localhost:5000/api/admin/receivable-ledger-history');
        if (historyResponse.data.status) {
          setTransactions(historyResponse.data.result);
          updateProjectSummary();
        }

        setShowForm(false);
      } else {
        throw new Error(response.data.msg || 'Failed to save receivable ledger entry');
      }
    } catch (error) {
      console.error('Error submitting receivable ledger:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      MySwal.fire({
        icon: 'error',
        title: 'Submission Error',
        text: error.response?.data?.msg || 'Failed to save receivable ledger entry. Please try again.',
      });
    }
  };

  const showTransactionScreenshot = (transaction) => {
    MySwal.fire({
      imageUrl: `http://localhost:5000/${transaction.transaction_screenshot}`,
      imageAlt: 'Transaction Screenshot',
      showCloseButton: true,
      showConfirmButton: false,
      customClass: {
        popup: 'rounded-xl shadow-xl p-6 bg-white max-w-lg',
        image: 'rounded-lg border border-gray-200 max-w-full h-auto max-h-96',
      },
      footer: (
        <div className="flex gap-4 justify-center">
          <a
            href={`http://localhost:5000/${transaction.transaction_screenshot}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <Eye className="w-4 h-4" /> View Full
          </a>
          <a
            href={`http://localhost:5000/${transaction.transaction_screenshot}`}
            download
            className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <Download className="w-4 h-4" /> Download
          </a>
        </div>
      ),
    });
  };

  // Group transactions by project_name
  const groupedTransactions = transactions.reduce((acc, transaction) => {
    const projectName = transaction.project_name;
    if (!acc[projectName]) {
      acc[projectName] = [];
    }
    acc[projectName].push(transaction);
    return acc;
  }, {});

  if (createdBy === null) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">Invalid user ID in the URL. Please check and try again.</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Wallet className="w-6 h-6 text-indigo-600" />
            Receivable Ledger
          </h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-300"
          >
            <CreditCard className="w-5 h-5" />
            <span className="hidden md:inline">Add Transaction</span>
          </button>
        </div>

        {/* Project Selection and Summary */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Project</label>
            <select
              name="projectId"
              value={formData.projectId}
              onChange={handleInputChange}
              className="w-full md:w-1/3 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-3 px-4 border"
            >
              <option value="">Select Project</option>
              {projects.map(project => (
                <option key={project.project_id} value={project.project_id}>
                  {project.project_name} - [{project.client_name}]
                </option>
              ))}
            </select>
          </div>

          {selectedProject && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-indigo-50 p-4 rounded-lg text-center">
                <div className="text-sm text-indigo-600 font-medium">Total Amount</div>
                <div className="text-lg font-bold text-indigo-800">₹{parseFloat(selectedProject.total_amount).toFixed(2)}</div>
              </div>
              <div className="bg-emerald-50 p-4 rounded-lg text-center">
                <div className="text-sm text-emerald-600 font-medium">Paid Amount</div>
                <div className="text-lg font-bold text-emerald-800">₹{totalPaid.toFixed(2)}</div>
              </div>
              <div className={`p-4 rounded-lg text-center ${balanceAmount <= 0 ? 'bg-teal-50' : 'bg-amber-50'}`}>
                <div className={`text-sm font-medium ${balanceAmount <= 0 ? 'text-teal-600' : 'text-amber-600'}`}>
                  {balanceAmount <= 0 ? 'Status' : 'Balance Amount'}
                </div>
                <div className={`text-lg font-bold ${balanceAmount <= 0 ? 'text-teal-800' : 'text-amber-800'}`}>
                  {balanceAmount <= 0 ? 'Payment Completed' : `₹${balanceAmount.toFixed(2)}`}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Add Transaction Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
              className={`bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden ${balanceAmount <= 0 ? 'bg-gray-100' : ''}`}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-indigo-600" />
                    Add Receivable Transaction
                  </h2>
                  <div className="flex items-center gap-4">
                    {balanceAmount <= 0 && (
                      <div className="bg-teal-50 border border-teal-200 text-teal-800 p-3 rounded-lg text-sm">
                        <div className="font-medium">Full payment received for this project.</div>
                        <div>No further payments can be added.</div>
                      </div>
                    )}
                    <button
                      onClick={() => setShowForm(false)}
                      className="text-gray-500 hover:text-gray-700 transition duration-200"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Client Name and Paid Amount */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
                      <input
                        type="text"
                        name="clientName"
                        value={formData.clientName}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-3 px-4 border"
                        placeholder="Enter client name"
                        required
                        disabled={balanceAmount <= 0}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Paid Amount (₹)</label>
                      <input
                        type="number"
                        name="paidAmount"
                        value={formData.paidAmount}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-3 px-4 border"
                        placeholder="Enter amount"
                        required
                        disabled={balanceAmount <= 0}
                        min="0"
                        step="0.01"
                      />
                    </div>

                    {/* UPI Details */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">From UPI ID</label>
                      <input
                        type="text"
                        name="fromUpiId"
                        value={formData.fromUpiId}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-3 px-4 border"
                        placeholder="client@upi"
                        required
                        disabled={balanceAmount <= 0}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">To UPI ID</label>
                      <input
                        type="text"
                        name="toUpiId"
                        value={formData.toUpiId}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-3 px-4 border"
                        placeholder="company@upi"
                        required
                        disabled={balanceAmount <= 0}
                      />
                    </div>

                    {/* Transaction ID and Screenshot */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID/UTR</label>
                      <input
                        type="text"
                        name="transactionId"
                        value={formData.transactionId}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-3 px-4 border"
                        placeholder="Enter transaction ID"
                        required
                        disabled={balanceAmount <= 0}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Proof</label>
                      <input
                        type="file"
                        onChange={handleFileChange}
                        className="w-full text-sm text-gray-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        accept="image/*,.pdf"
                        required
                        disabled={balanceAmount <= 0}
                      />
                    </div>

                    {/* Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                      <DatePicker
                        selected={formData.dateTime}
                        onChange={handleDateChange}
                        showTimeSelect
                        dateFormat="Pp"
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-3 px-4 border"
                        required
                        disabled={balanceAmount <= 0}
                      />
                    </div>
                  </div>

                  {balanceAmount > 0 && (
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow hover:bg-indigo-700 transition duration-300 text-sm font-medium flex items-center gap-2"
                      >
                        <CreditCard className="w-5 h-5" />
                        Record Transaction
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Transaction History */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              Transaction History
            </h2>

            {Object.entries(groupedTransactions).length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">No transactions recorded yet</div>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-300 text-sm font-medium flex items-center gap-2 mx-auto"
                >
                  <CreditCard className="w-4 h-4" />
                  Add First Transaction
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {Object.entries(groupedTransactions).map(([projectName, projectTransactions]) => (
                  <div key={projectName}>
                    <div className="bg-indigo-50 px-4 py-3 rounded-t-lg mb-0">
                      <h3 className="font-semibold text-indigo-800">{projectName}</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-indigo-100">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Client</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">From UPI</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">To UPI</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Transaction ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Date & Time</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">Recorded By</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {projectTransactions.map(transaction => (
                            <tr key={transaction.id} className="hover:bg-gray-50 transition duration-150">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {transaction.client_name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                                ₹{parseFloat(transaction.paid_amount).toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                <div className="max-w-xs truncate">{transaction.from_upi_id}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                <div className="max-w-xs truncate">{transaction.to_upi_id}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                <div className="max-w-xs truncate font-mono">{transaction.transaction_id}</div>
                                {transaction.transaction_screenshot && (
                                  <button
                                    onClick={() => showTransactionScreenshot(transaction)}
                                    className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 mt-1"
                                  >
                                    <Eye className="w-4 h-4" />
                                    <span className="text-sm">View Screenshot</span>
                                  </button>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {new Date(transaction.date_time).toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                <div>{transaction.created_by_name}</div>
                                <div className="text-xs text-gray-500">
                                  {new Date(transaction.created_at).toLocaleDateString()}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceivableLedger;