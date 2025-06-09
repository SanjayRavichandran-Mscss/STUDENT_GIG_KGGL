import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const Ledger = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    paymentMethod: 'Bank Transfer',
    projectName: '',
    clientName: '',
    transactionType: '',
    paymentStatus: '',
    amount: '',
    fromAccount: '',
    toAccount: '',
    transactionId: '',
    transactionScreenshot: null,
    cashImage: null,
    numberOfStudents: '',
    students: [],
  });

  useEffect(() => {
    const storedTransactions = JSON.parse(localStorage.getItem('transactions')) || [];
    setTransactions(storedTransactions);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleStudentInputChange = (index, field, value) => {
    const updatedStudents = [...formData.students];
    updatedStudents[index] = { ...updatedStudents[index], [field]: value };
    setFormData((prev) => ({ ...prev, students: updatedStudents }));
  };

  const handleNumberOfStudentsChange = (e) => {
    const count = parseInt(e.target.value) || 0;
    const students = Array.from({ length: count }, () => ({ name: '', amount: '' }));
    setFormData((prev) => ({ ...prev, numberOfStudents: count, students }));
  };

  const validateForm = () => {
    if (!formData.projectName || !formData.clientName || !formData.transactionType || !formData.paymentStatus || !formData.amount) {
      MySwal.fire({
        icon: 'error',
        title: 'Missing Fields',
        text: 'Please fill all required fields.',
      });
      return false;
    }
    if (formData.transactionType === 'Payment to Student') {
      const totalStudentAmount = formData.students.reduce((sum, student) => sum + (parseFloat(student.amount) || 0), 0);
      if (totalStudentAmount !== parseFloat(formData.amount)) {
        MySwal.fire({
          icon: 'error',
          title: 'Amount Mismatch',
          text: 'The sum of student amounts must equal the total amount.',
        });
        return false;
      }
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newTransaction = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      ...formData,
      type: formData.transactionType === 'Payment from Client' ? 'Credit' : 'Debit',
    };

    const updatedTransactions = [...transactions, newTransaction];
    setTransactions(updatedTransactions);
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));

    MySwal.fire({
      icon: 'success',
      title: 'Transaction Added',
      text: 'Your transaction has been successfully recorded!',
    });

    setFormData({
      paymentMethod: 'Bank Transfer',
      projectName: '',
      clientName: '',
      transactionType: '',
      paymentStatus: '',
      amount: '',
      fromAccount: '',
      toAccount: '',
      transactionId: '',
      transactionScreenshot: null,
      cashImage: null,
      numberOfStudents: '',
      students: [],
    });
    setIsFormOpen(false);
  };

  const showTransactionDetails = (transaction) => {
    MySwal.fire({
      title: 'Transaction Details',
      html: (
        <div className="text-left space-y-3 text-sm">
          <div>
            <strong>Date:</strong> {transaction.date}
          </div>
          <div>
            <strong>Project Name:</strong> {transaction.projectName}
          </div>
          <div>
            <strong>Client Name:</strong> {transaction.clientName}
          </div>
          <div>
            <strong>Type:</strong>{' '}
            <span className={transaction.type === 'Credit' ? 'text-green-600' : 'text-orange-400'}>
              {transaction.type}
            </span>
          </div>
          <div>
            <strong>Payment Status:</strong> {transaction.paymentStatus}
          </div>
          <div>
            <strong>Amount:</strong> ₹{transaction.amount}
          </div>
          <div>
            <strong>Payment Method:</strong> {transaction.paymentMethod}
          </div>
          {transaction.paymentMethod === 'Bank Transfer' && (
            <>
              <div>
                <strong>From Account:</strong> {transaction.fromAccount || 'N/A'}
              </div>
              <div>
                <strong>To Account:</strong> {transaction.toAccount || 'N/A'}
              </div>
              <div>
                <strong>Transaction ID:</strong> {transaction.transactionId || 'N/A'}
              </div>
              <div>
                <strong>Transaction Screenshot:</strong>{' '}
                {transaction.transactionScreenshot ? 'Uploaded' : 'N/A'}
              </div>
            </>
          )}
          {transaction.paymentMethod === 'Cash' && (
            <div>
              <strong>Cash Image:</strong> {transaction.cashImage ? 'Uploaded' : 'N/A'}
            </div>
          )}
          {transaction.transactionType === 'Payment to Student' && transaction.students && transaction.students.length > 0 && (
            <div>
              <strong>Students:</strong>
              <ul className="list-disc list-inside mt-1">
                {transaction.students.map((student, index) => (
                  <li key={index}>
                    {student.name}: ₹{student.amount}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ),
      showCloseButton: true,
      confirmButtonText: 'Close',
      customClass: {
        popup: 'rounded-lg shadow-xl p-4 bg-white max-w-md',
        title: 'text-lg font-bold text-gray-800 mb-3',
        htmlContainer: 'text-gray-600',
        confirmButton: 'bg-indigo-600 text-white px-3 py-1 rounded-lg hover:bg-indigo-700 transition duration-300 text-sm',
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-gray-800">Ledger Details</h1>
          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="bg-indigo-600 text-white px-3 py-1 rounded-lg hover:bg-indigo-700 transition duration-300 flex items-center gap-1 text-sm"
          >
            {isFormOpen ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Close Form
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Add Transaction
              </>
            )}
          </button>
        </div>

        {isFormOpen && (
          <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700">Payment Method</label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">Project Name</label>
                  <select
                    name="projectName"
                    value={formData.projectName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                  >
                    <option value="">Select Project</option>
                    <option value="StockPulse">StockPulse</option>
                    <option value="TrafficFlow">TrafficFlow</option>
                    <option value="MediTrack">MediTrack</option>
                    <option value="OrderSync">OrderSync</option>
                    <option value="FraudShield">FraudShield</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">Client Name</label>
                  <input
                    type="text"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">Transaction Type</label>
                  <select
                    name="transactionType"
                    value={formData.transactionType}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                  >
                    <option value="">Select Type</option>
                    <option value="Payment from Client">Payment from Client</option>
                    <option value="Payment to Student">Payment to Student</option>
                  </select>
                </div>
              </div>

              {formData.transactionType && (
                <div className="border-t pt-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700">Payment Status</label>
                      <select
                        name="paymentStatus"
                        value={formData.paymentStatus}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                      >
                        <option value="">Select Status</option>
                        <option value="Advance Payment">Advance Payment</option>
                        <option value="Full Payment">Full Payment</option>
                        <option value="Remaining Payment">Remaining Payment</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700">Amount</label>
                      <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                      />
                    </div>
                    {formData.paymentMethod === 'Bank Transfer' && (
                      <>
                        <div>
                          <label className="block text-xs font-medium text-gray-700">From Account Number</label>
                          <input
                            type="text"
                            name="fromAccount"
                            value={formData.fromAccount}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700">To Account Number</label>
                          <input
                            type="text"
                            name="toAccount"
                            value={formData.toAccount}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700">Transaction ID</label>
                          <input
                            type="text"
                            name="transactionId"
                            value={formData.transactionId}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700">Transaction Screenshot</label>
                          <input
                            type="file"
                            name="transactionScreenshot"
                            onChange={handleInputChange}
                            className="mt-1 block w-full text-sm"
                          />
                        </div>
                      </>
                    )}
                    {formData.paymentMethod === 'Cash' && (
                      <div>
                        <label className="block text-xs font-medium text-gray-700">Cash Image</label>
                        <input
                          type="file"
                          name="cashImage"
                          onChange={handleInputChange}
                          className="mt-1 block w-full text-sm"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {formData.transactionType === 'Payment to Student' && (
                <div className="border-t pt-3">
                  <div className="mb-3">
                    <label className="block text-xs font-medium text-gray-700">Number of Students</label>
                    <input
                      type="number"
                      name="numberOfStudents"
                      value={formData.numberOfStudents}
                      onChange={handleNumberOfStudentsChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                    />
                  </div>
                  {formData.students.map((student, index) => (
                    <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700">Student Name {index + 1}</label>
                        <input
                          type="text"
                          value={student.name}
                          onChange={(e) => handleStudentInputChange(index, 'name', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700">Amount</label>
                        <input
                          type="number"
                          value={student.amount}
                          onChange={(e) => handleStudentInputChange(index, 'amount', e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-1 rounded-lg hover:bg-indigo-700 transition duration-300 text-sm"
                >
                  Submit Transaction
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-base font-semibold text-gray-800 mb-3">Transaction History</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{transaction.date}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {transaction.transactionType === 'Payment to Student' ? (
                        <ul className="list-disc list-inside">
                          {transaction.students.map((student, index) => (
                            <li key={index}>
                              {student.name}: ₹{student.amount}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <>
                          <div>Project: {transaction.projectName}</div>
                          <div>Client: {transaction.clientName}</div>
                          <div>Amount: ₹{transaction.amount}</div>
                          <div>Status: {transaction.paymentStatus}</div>
                        </>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      <span className={transaction.type === 'Credit' ? 'text-green-600' : 'text-orange-400'}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => showTransactionDetails(transaction)}
                        className="bg-indigo-600 text-white px-2 py-1 rounded-lg hover:bg-indigo-700 transition duration-300 text-sm"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ledger;