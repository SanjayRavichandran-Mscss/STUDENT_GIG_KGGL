import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import { 
  Edit, Eye, PlusCircle, X, FileText, User, 
  Calendar, Check, AlertTriangle, Wallet, Maximize2, File
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';
import { debounce } from 'lodash';

const MySwal = withReactContent(Swal);

const formatDateForMySQL = (date) => {
  const pad = (num) => String(num).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

const projectColors = [
  'bg-teal-50 border-l-4 border-teal-500',
  'bg-indigo-50 border-l-4 border-indigo-500',
  'bg-emerald-50 border-l-4 border-emerald-500',
  'bg-cyan-50 border-l-4 border-cyan-500',
];

const FilePreview = ({ fileUrl }) => {
  const fileExtension = fileUrl?.split('.').pop()?.toLowerCase();
  
  if (!fileUrl) return null;

  if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
    return (
      <PhotoView src={fileUrl}>
        <div className="relative group cursor-pointer">
          <img 
            src={fileUrl} 
            alt="Transaction Screenshot" 
            className="rounded-lg border border-gray-200 w-full h-auto max-h-40 object-contain"
          />
          <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <Maximize2 className="w-6 h-6 text-white drop-shadow-lg" />
          </div>
        </div>
      </PhotoView>
    );
  } else if (fileExtension === 'pdf') {
    return (
      <div className="border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50 h-40">
        <File className="w-10 h-10 text-red-500 mb-2" />
        <span className="text-sm font-medium text-gray-700">PDF Document</span>
        <a 
          href={fileUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="mt-2 text-sm text-blue-600 hover:underline"
        >
          View PDF
        </a>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50 h-40">
      <File className="w-10 h-10 text-gray-500 mb-2" />
      <span className="text-sm font-medium text-gray-700">Document</span>
      <a 
        href={fileUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="mt-2 text-sm text-blue-600 hover:underline"
      >
        View File
      </a>
    </div>
  );
};

const FullScreenTransactionModal = ({ transaction, studentDetails, onClose }) => {
  return (
    <div className="fixed inset-0 w-full h-screen bg-gray-50 overflow-y-auto z-50">
      <style>
        {`
          .PhotoView-Portal {
            --PhotoView-Backdrop-bg: rgba(0, 0, 0, 0) !important;
          }
          .PhotoView-Slider__Backdrop {
            background: none !important;
          }
        `}
      </style>
      <div className="relative max-w-7xl mx-auto p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-8 h-8 text-teal-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            {transaction.project_name} - {transaction.client_name}
          </h2>
        </div>

        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-emerald-50 p-6 rounded-xl shadow-sm">
              <div className="text-xs text-emerald-600 font-medium uppercase tracking-wide">Expense Type</div>
              <div className="font-semibold text-base text-gray-800">
                {transaction.expense_type === 'Operational Payment' && transaction.expense_subtype
                  ? `${transaction.expense_type} - ${transaction.expense_subtype}`
                  : transaction.expense_type}
              </div>
            </div>
            <div className="bg-emerald-50 p-6 rounded-xl shadow-sm">
              <div className="text-xs text-emerald-600 font-medium uppercase tracking-wide">Petty Cash</div>
              <div className="font-semibold text-base text-gray-800">₹{parseFloat(transaction.petty_cash).toFixed(2)}</div>
            </div>
            {transaction.pettycash_description && (
              <div className="bg-emerald-50 p-6 rounded-xl shadow-sm md:col-span-2">
                <div className="text-xs text-emerald-600 font-medium uppercase tracking-wide">Petty Cash Remarks</div>
                <div className="font-semibold text-base text-gray-800">{transaction.pettycash_description}</div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <h3 className="font-semibold text-xl text-gray-900">Student Payments ({studentDetails.length})</h3>
            <PhotoProvider>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 p-4">
                {studentDetails.map((student, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow duration-300 w-full"
                  >
                    <div className="p-6 flex justify-between items-center bg-emerald-50 border-b border-gray-100">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-emerald-100 rounded-full">
                          <User className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div className="font-semibold text-lg text-gray-800">{student.name}</div>
                      </div>
                      <div className="font-bold text-xl text-emerald-700">₹{parseFloat(student.amount).toFixed(2)}</div>
                    </div>
                    
                    <div className="p-6 bg-white space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                        <div className="space-y-2">
                          <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Transaction ID</div>
                          <div className="font-mono text-gray-700">{student.transactionId}</div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Date & Time</div>
                          <div className="text-gray-700">{new Date(student.dateTime).toLocaleString()}</div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">From UPI</div>
                          <div className="font-mono text-gray-700">{student.fromUpiId}</div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">To UPI</div>
                          <div className="font-mono text-gray-700">{student.toUpiId}</div>
                        </div>
                      </div>

                      {student.amountDescription && (
                        <div className="bg-emerald-50 p-6 rounded-xl shadow-sm">
                          <div className="text-xs text-emerald-600 font-medium uppercase tracking-wide">Amount Remarks</div>
                          <div className="font-semibold text-base text-gray-800">{student.amountDescription}</div>
                        </div>
                      )}

                      {student.transaction_screenshot && (
                        <div className="space-y-4">
                          <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-2">Transaction Proof</div>
                          <div className="relative rounded-lg overflow-hidden">
                            <FilePreview 
                              fileUrl={`https://gig.kggeniuslabs.com/api/${student.transaction_screenshot}`} 
                              className="w-full h-auto"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </PhotoProvider>
          </div>

          <div className="flex items-start gap-4 pt-6 border-t border-gray-200">
            <User className="w-6 h-6 mt-0.5 text-emerald-600" />
            <div>
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Recorded By</div>
              <div className="text-base font-semibold text-gray-800">{transaction.created_by_name}</div>
              <div className="text-xs text-gray-500">{new Date(transaction.created_at).toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PayableLedger = () => {
  const { id } = useParams();
  const [createdBy, setCreatedBy] = useState(null);
  const [expenseType, setExpenseType] = useState('');
  const [expenseSubType, setExpenseSubType] = useState('');
  const [expenseTypes, setExpenseTypes] = useState([]);
  const [customSubOptions, setCustomSubOptions] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [students, setStudents] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [formData, setFormData] = useState({
    projectId: '',
    projectName: '',
    clientName: '',
    totalAmount: '0.00',
    teamSize: '0',
    students: [],
    pettyCash: '0.00',
    pettyCashDescription: '',
    expenseTypeId: '',
  });
  const [editableFields, setEditableFields] = useState({});
  const [modifiedFields, setModifiedFields] = useState({});
  const [projectStatus, setProjectStatus] = useState({});
  const [studentPaymentStatus, setStudentPaymentStatus] = useState({});
  const [paidProjects, setPaidProjects] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    try {
      if (!id) throw new Error('No ID provided in the URL.');
      const decodedId = atob(id);
      const parsedId = parseInt(decodedId, 10);
      if (isNaN(parsedId)) throw new Error('Invalid decoded ID.');
      setCreatedBy(parsedId);
    } catch (error) {
      console.error('Error decoding ID:', error.message);
      MySwal.fire({
        icon: 'error',
        title: 'Invalid ID',
        text: 'The ID in the URL is invalid or not properly encoded.',
      });
    }
  }, [id]);

  const fetchData = useCallback(async () => {
    if (createdBy === null) return;
    
    setIsLoading(true);
    try {
      const [expenseResponse, studentsResponse, projectsResponse, historyResponse, receivableResponse] = await Promise.all([
        axios.get('https://gig.kggeniuslabs.com/api/api/admin/expense-types'),
        axios.get('https://gig.kggeniuslabs.com/api/api/admin/student-details'),
        axios.get('https://gig.kggeniuslabs.com/api/api/admin/getallprojects'),
        axios.get('https://gig.kggeniuslabs.com/api/api/admin/payable-ledger-history'),
        axios.get('https://gig.kggeniuslabs.com/api/api/admin/receivable-ledger-history'),
      ]);

      if (expenseResponse.data.status) setExpenseTypes(expenseResponse.data.result);
      if (studentsResponse.data.status) setStudents(studentsResponse.data.result);
      if (projectsResponse.data.length > 0) {
        setProjects(projectsResponse.data);
      }
      if (historyResponse.data.status) setTransactions(historyResponse.data.result);

      const status = {};
      const studentStatus = {};
      projectsResponse.data.forEach((project) => {
        const totalAmount = parseFloat(project.total_amount);
        const paidAmount = receivableResponse.data.result
          .filter((t) => t.project_name === project.project_name)
          .reduce((sum, t) => sum + parseFloat(t.paid_amount), 0);
        status[project.project_id] = {
          totalAmount: totalAmount.toFixed(2),
          paidAmount: paidAmount.toFixed(2),
          isComplete: Math.abs(totalAmount - paidAmount) < 0.01,
          balanceAmount: (totalAmount - paidAmount).toFixed(2),
        };

        const studentPaid = historyResponse.data.result
          .filter((t) => t.project_name === project.project_name)
          .reduce((sum, t) => sum + parseFloat(t.petty_cash) + 
            (typeof t.student_details === 'string' 
              ? JSON.parse(t.student_details).reduce((s, st) => s + parseFloat(st.amount), 0)
              : t.student_details.reduce((s, st) => s + parseFloat(st.amount), 0)), 0);
        studentStatus[project.project_id] = {
          totalAmount: totalAmount.toFixed(2),
          paidAmount: studentPaid.toFixed(2),
          isComplete: Math.abs(totalAmount - studentPaid) < 0.01,
          balanceAmount: (totalAmount - studentPaid).toFixed(2),
        };
      });
      setProjectStatus(status);
      setStudentPaymentStatus(studentStatus);

      const paid = {};
      historyResponse.data.forEach((transaction) => {
        const project = projectsResponse.data.find((p) => p.project_name === transaction.project_name);
        if (project) {
          paid[project.project_id] = {
            isPaid: true,
            details: {
              projectId: project.project_id,
              projectName: project.project_name,
              clientName: transaction.client_name,
              totalAmount: parseFloat(project.total_amount).toFixed(2),
              teamSize: transaction.team_size,
              pettyCash: parseFloat(transaction.petty_cash).toFixed(2),
              pettyCashDescription: transaction.pettycash_description || '',
              expenseTypeId: transaction.expense_type_id,
              students: (typeof transaction.student_details === 'string'
                ? JSON.parse(transaction.student_details)
                : transaction.student_details
              ).map((s) => ({
                studentId: s.studentId || '',
                name: s.name || '',
                defaultAmount: parseFloat(s.amount).toFixed(2),
                amount: parseFloat(s.amount).toFixed(2),
                amountDescription: s.amountDescription || '',
                fromUpiId: s.fromUpiId || '',
                toUpiId: s.toUpiId || '',
                transactionId: s.transactionId || '',
                dateTime: new Date(s.dateTime || new Date()),
                transactionScreenshot: null,
                transaction_screenshot: s.transaction_screenshot || null,
              })),
            },
          };
        }
      });
      setPaidProjects(paid);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    
    } finally {
      setIsLoading(false);
    }
  }, [createdBy]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleProjectSelect = useCallback((project, showForm = false) => {
    setSelectedProject(project);
    setIsFormOpen(showForm);
    setExpenseType('');
    setExpenseSubType('');
    setFormData({
      projectId: project.project_id || '',
      projectName: project.project_name || '',
      clientName: project.client_name || '',
      totalAmount: parseFloat(project.total_amount || 0).toFixed(2),
      teamSize: '0',
      students: [],
      pettyCash: '0.00',
      pettyCashDescription: '',
      expenseTypeId: '',
    });
    setEditableFields({});
    setModifiedFields({});
  }, []);

  const handleSelectExpenseType = useCallback((option) => {
    if (option.value === 'add-custom') {
      handleAddCustomSubOption();
      return;
    }
    const type = expenseTypes.find(et => et.id === option.value);
    if (type) {
      setExpenseType(type.type);
      setExpenseSubType(type.subtype || '');
      setFormData(prev => ({
        ...prev,
        expenseTypeId: type.id,
        teamSize: '0',
        students: [],
        pettyCash: prev.totalAmount ? (parseFloat(prev.totalAmount) * 0.1).toFixed(2) : '0.00',
        pettyCashDescription: '',
      }));
      setEditableFields({ pettyCash: false });
      setModifiedFields({ pettyCash: false });
      setIsFormOpen(true);
    }
  }, [expenseTypes]);

  const handleAddCustomSubOption = useCallback(() => {
    MySwal.fire({
      title: 'Add Custom Operational Expense',
      input: 'text',
      inputPlaceholder: 'Enter custom expense type (e.g., Travel)',
      showCancelButton: true,
      confirmButtonText: 'Add',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'rounded-xl shadow-lg p-6 bg-white max-w-sm',
        title: 'text-base font-semibold text-gray-900 mb-4',
        input: 'border-gray-300 rounded-md text-sm focus:border-teal-500 focus:ring-teal-500 py-2 px-3',
        confirmButton: 'bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition duration-300 text-sm ml-2',
        cancelButton: 'bg-gray-200 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-300 transition duration-300 text-sm',
      },
      preConfirm: (value) => {
        if (!value || value.trim() === '') {
          MySwal.showValidationMessage('Please enter a valid expense type.');
        } else if (
          expenseTypes.some((et) => et.subtype === value.trim() && et.type === 'Operational Payment') ||
          customSubOptions.includes(value.trim())
        ) {
          MySwal.showValidationMessage('This expense type already exists.');
        } else {
          return value.trim();
        }
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const newSubOption = result.value;
        try {
          const response = await axios.post('https://gig.kggeniuslabs.com/api/api/admin/expense-types', {
            type: 'Operational Payment',
            subtype: newSubOption,
          });
          if (response.data.status) {
            setExpenseTypes([...expenseTypes, response.data.result]);
            setCustomSubOptions([...customSubOptions, newSubOption]);
            handleSelectExpenseType({ value: response.data.result.id });
          }
        } catch (error) {
          console.error('Error adding custom sub-type:', error.message);
          MySwal.fire({ 
            icon: 'error', 
            title: 'Error', 
            text: 'Failed to add custom expense type.' 
          });
        }
      }
    });
  }, [expenseTypes, customSubOptions, handleSelectExpenseType]);

  const resetForm = useCallback(() => {
    setExpenseType('');
    setExpenseSubType('');
    setIsFormOpen(false);
    setFormData({
      projectId: '',
      projectName: '',
      clientName: '',
      totalAmount: '0.00',
      teamSize: '0',
      students: [],
      pettyCash: '0.00',
      pettyCashDescription: '',
      expenseTypeId: '',
    });
    setEditableFields({});
    setModifiedFields({});
    setSelectedProject(null);
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    if (name === 'teamSize') {
      const teamSize = parseInt(value) || 0;
      const studentAmount = formData.totalAmount ? (parseFloat(formData.totalAmount) * 0.9) / (teamSize || 1) : 0;
      const students = Array.from({ length: teamSize }, () => ({
        studentId: '',
        name: '',
        defaultAmount: studentAmount.toFixed(2),
        amount: studentAmount.toFixed(2),
        amountDescription: '',
        fromUpiId: '',
        toUpiId: '',
        transactionId: '',
        dateTime: new Date(),
        transactionScreenshot: null,
      }));
      setFormData((prev) => ({
        ...prev,
        teamSize: value,
        students,
        pettyCash: formData.totalAmount ? (parseFloat(formData.totalAmount) * 0.1).toFixed(2) : '0.00',
      }));
      setEditableFields((prev) => {
        const newEditableFields = { pettyCash: prev.pettyCash };
        for (let i = 0; i < teamSize; i++) {
          newEditableFields[`student-${i}`] = false;
        }
        return newEditableFields;
      });
      setModifiedFields((prev) => {
        const newModifiedFields = { pettyCash: prev.pettyCash };
        for (let i = 0; i < teamSize; i++) {
          newModifiedFields[`student-${i}`] = false;
        }
        return newModifiedFields;
      });
    } else if (name === 'pettyCash') {
      const numericValue = parseFloat(value) || 0;
      const defaultPettyCash = (parseFloat(formData.totalAmount) * 0.1).toFixed(2);
      setFormData((prev) => ({
        ...prev,
        pettyCash: value,
        pettyCashDescription: numericValue !== parseFloat(defaultPettyCash) ? prev.pettyCashDescription : '',
      }));
      setModifiedFields((prev) => ({
        ...prev,
        pettyCash: numericValue !== parseFloat(defaultPettyCash),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  }, [formData.totalAmount]);

  const handleStudentInputChange = useCallback((index, field, value) => {
    const updatedStudents = [...formData.students];
    if (field === 'studentId') {
      const selectedStudent = students.find((s) => s.student_id === parseInt(value));
      updatedStudents[index] = {
        ...updatedStudents[index],
        studentId: value,
        name: selectedStudent ? selectedStudent.name : '',
      };
    } else if (field === 'amount') {
      const defaultAmount = updatedStudents[index].defaultAmount;
      updatedStudents[index] = {
        ...updatedStudents[index],
        amount: value,
        amountDescription: value !== defaultAmount ? updatedStudents[index].amountDescription : '',
      };
      setModifiedFields((prev) => ({
        ...prev,
        [`student-${index}`]: value !== defaultAmount,
      }));
    } else {
      updatedStudents[index] = { ...updatedStudents[index], [field]: value };
    }
    setFormData((prev) => ({ ...prev, students: updatedStudents }));
  }, [formData.students, students]);

  const handleStudentDateChange = useCallback((index, date) => {
    const updatedStudents = [...formData.students];
    updatedStudents[index] = { ...updatedStudents[index], dateTime: date };
    setFormData((prev) => ({ ...prev, students: updatedStudents }));
  }, [formData.students]);

  const handleStudentFileChange = useCallback((index, e) => {
    const file = e.target.files[0];
    if (file && !['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'].includes(file.type)) {
      MySwal.fire({
        icon: 'error',
        title: 'Invalid File Type',
        text: 'Please upload a JPEG, PNG, or PDF file.',
      });
      return;
    }
    if (file && file.size > 5 * 1024 * 1024) {
      MySwal.fire({
        icon: 'error',
        title: 'File Too Large',
        text: 'File size must be less than 5MB.',
      });
      return;
    }
    const updatedStudents = [...formData.students];
    updatedStudents[index] = { ...updatedStudents[index], transactionScreenshot: file };
    setFormData((prev) => ({ ...prev, students: updatedStudents }));
  }, [formData.students]);

  const toggleEditableField = useCallback((field) => {
    setEditableFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  }, []);

  const validateForm = useCallback(() => {
    const { projectId, clientName, totalAmount, teamSize, students, pettyCash, expenseTypeId } = formData;

    if (paidProjects[projectId]?.isPaid) {
      toast.info('This project has already been processed in the payable ledger.', {
        icon: <Check className="w-6 h-6 text-teal-500" />,
      });
      return false;
    }

    if (!projectStatus[projectId]?.isComplete) {
      toast.warning('The full payment for this project has not been received from the client.', {
        icon: <AlertTriangle className="w-6 h-6 text-amber-500" />,
      });
      return false;
    }

    if (!projectId || !clientName || !totalAmount || !teamSize || !pettyCash || !expenseTypeId) {
      MySwal.fire({
        icon: 'error',
        title: 'Missing Field',
        text: 'All required fields must be filled.',
      });
      return false;
    }

    const parsedTeamSize = parseInt(teamSize);
    if (isNaN(parsedTeamSize) || parsedTeamSize <= 0) {
      MySwal.fire({
        icon: 'error',
        title: 'Invalid Input',
        text: 'Team size must be a positive integer.',
      });
      return false;
    }

    if (students.length !== parsedTeamSize) {
      MySwal.fire({
        icon: 'error',
        title: 'Invalid Input',
        text: 'Number of students must match the team size.',
      });
      return false;
    }

    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      if (!student.studentId || !student.name || !student.amount || !student.fromUpiId || 
          !student.toUpiId || !student.transactionId || !student.dateTime || !student.transactionScreenshot) {
        MySwal.fire({
          icon: 'error',
          title: 'Missing Field',
          text: `All fields for Student ${i + 1} are required.`,
        });
        return false;
      }
      const studentAmount = parseFloat(student.amount);
      if (isNaN(studentAmount) || studentAmount < 0) {
        MySwal.fire({
          icon: 'error',
          title: 'Invalid Input',
          text: `Amount for Student ${i + 1} must be a non-negative number.`,
        });
        return false;
      }
      if (modifiedFields[`student-${i}`] && !student.amountDescription) {
        MySwal.fire({
          icon: 'error',
          title: 'Missing Field',
          text: `Please provide remarks for the modified amount of Student ${i + 1}.`,
        });
        return false;
      }
    }

    const parsedPettyCash = parseFloat(pettyCash);
    if (isNaN(parsedPettyCash) || parsedPettyCash < 0) {
      MySwal.fire({
        icon: 'error',
        title: 'Invalid Input',
        text: 'Petty cash must be a non-negative number.',
      });
      return false;
    }
    if (modifiedFields.pettyCash && !formData.pettyCashDescription) {
      MySwal.fire({
        icon: 'error',
        title: 'Missing Field',
        text: 'Please provide remarks for the modified petty cash amount.',
      });
      return false;
    }

    const totalStudentAmount = students.reduce((sum, student) => sum + parseFloat(student.amount), 0);
    const totalDistributed = totalStudentAmount + parsedPettyCash;
    if (Math.abs(totalDistributed - parseFloat(totalAmount)) > 0.01) {
      MySwal.fire({
        icon: 'error',
        title: 'Invalid Input',
        text: `Total distributed amount (₹${totalDistributed.toFixed(2)}) must equal the total project amount (₹${parseFloat(totalAmount).toFixed(2)}).`,
      });
      return false;
    }

    return true;
  }, [formData, paidProjects, projectStatus, modifiedFields]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('expense_type_id', formData.expenseTypeId);
      formDataToSend.append('project_id', formData.projectId);
      formDataToSend.append('client_name', formData.clientName);
      formDataToSend.append('team_size', formData.teamSize);
      formDataToSend.append('student_details', JSON.stringify(formData.students.map(s => ({
        studentId: s.studentId,
        name: s.name,
        amount: s.amount,
        amountDescription: s.amountDescription,
        fromUpiId: s.fromUpiId,
        toUpiId: s.toUpiId,
        transactionId: s.transactionId,
        dateTime: s.dateTime.toISOString(),
      }))));
      formDataToSend.append('petty_cash', formData.pettyCash);
      if (formData.pettyCashDescription) {
        formDataToSend.append('pettycash_description', formData.pettyCashDescription);
      }
      formDataToSend.append('created_by', String(createdBy));

      formData.students.forEach((student, index) => {
        if (student.transactionScreenshot) {
          formDataToSend.append(`student_details[${index}][transaction_screenshot]`, student.transactionScreenshot);
        }
      });

      const response = await axios.post(
        'https://gig.kggeniuslabs.com/api/api/admin/save-payable-ledger',
        formDataToSend,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (response.data.status) {
        toast.success('Transaction recorded successfully!', {
          icon: <Check className="w-6 h-6 text-emerald-500" />,
        });
        const historyResponse = await axios.get('https://gig.kggeniuslabs.com/api/api/admin/payable-ledger-history');
        if (historyResponse.data.status) {
          setTransactions(historyResponse.data.result);
        }
        resetForm();
      }
    } catch (error) {
      console.error('Error submitting payable ledger:', error);
      toast.error(error.response?.data?.msg || 'Failed to save transaction.', {
        icon: <X className="w-6 h-6 text-red-500" />,
      });
    }
  }, [formData, createdBy, validateForm, resetForm]);

  const showTransactionDetails = useCallback((transaction) => {
    const studentDetails = typeof transaction.student_details === 'string'
      ? JSON.parse(transaction.student_details)
      : transaction.student_details;
    setSelectedTransaction({ ...transaction, studentDetails });
    setIsModalOpen(true);
  }, []);

  const groupedTransactions = useMemo(() => {
    return transactions.reduce((acc, transaction) => {
      const projectName = transaction.project_name;
      if (!acc[projectName]) {
        acc[projectName] = [];
      }
      acc[projectName].push(transaction);
      return acc;
    }, {});
  }, [transactions]);

  const sortedTransactions = useMemo(() => {
    return Object.entries(groupedTransactions).flatMap(([projectName, transactions]) =>
      transactions.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    );
  }, [groupedTransactions]);

  const projectColorMap = useMemo(() => {
    const map = {};
    Object.keys(groupedTransactions).forEach((projectName, index) => {
      map[projectName] = projectColors[index % projectColors.length];
    });
    return map;
  }, [groupedTransactions]);

  const expenseTypeOptions = useMemo(() => [
    ...expenseTypes
      .filter(et => !et.subtype || et.type === 'GIG Payment')
      .map(et => ({
        value: et.id,
        label: et.type,
      })),
    {
      label: 'Operational Payment',
      options: [
        ...expenseTypes
          .filter(et => et.type === 'Operational Payment' && et.subtype)
          .map(et => ({
            value: et.id,
            label: et.subtype,
          })),
        {
          value: 'add-custom',
          label: 'Add Custom Type...',
          isCreateOption: true,
        },
      ],
    },
  ], [expenseTypes]);

  const isFormDisabled = useMemo(() => 
    !selectedProject || 
    !projectStatus[selectedProject?.project_id]?.isComplete || 
    studentPaymentStatus[selectedProject?.project_id]?.isComplete,
  [selectedProject, projectStatus, studentPaymentStatus]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <div className="text-gray-700">Loading Payable Ledger...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Wallet className="w-6 h-6 text-emerald-600" />
            Payable Ledger
          </h1>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full sm:w-64"
          >
            <Select
              options={projects.map(project => ({
                value: project.project_id,
                label: `${project.project_name} - [${project.client_name}]`,
              }))}
              onChange={(option) => {
                const project = projects.find(p => p.project_id === option.value);
                if (project) handleProjectSelect(project);
              }}
              placeholder="Select Project"
              className="text-sm"
              isSearchable
              menuPortalTarget={document.body}
              styles={{
                menuPortal: base => ({ ...base, zIndex: 9999 }),
                control: (base) => ({
                  ...base,
                  minHeight: '44px',
                  borderRadius: '0.5rem',
                  borderColor: '#e5e7eb',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  '&:hover': {
                    borderColor: '#10b981',
                  },
                }),
                option: (base, { isFocused, isSelected }) => ({
                  ...base,
                  backgroundColor: isSelected ? '#10b981' : isFocused ? '#e0f2fe' : 'white',
                  color: isSelected ? 'white' : '#1f2937',
                  '&:active': {
                    backgroundColor: '#10b981',
                    color: 'white',
                  },
                }),
              }}
            />
          </motion.div>
        </div>

        {/* Project Status */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
            >
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{selectedProject.project_name}</h2>
                    <p className="text-gray-600 text-sm">{selectedProject.client_name}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsFormOpen(true)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
                      isFormDisabled ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                    disabled={isFormDisabled}
                  >
                    <PlusCircle className="w-4 h-4" />
                    Add Transaction
                  </motion.button>
                </div>

                <div className="space-y-6">
                  <div className="bg-teal-50 p-4 rounded-lg text-center">
                    <div className="text-sm text-teal-600 font-medium">Total Project Amount</div>
                    <div className="text-2xl font-bold text-teal-800">₹{parseFloat(selectedProject.total_amount).toFixed(2)}</div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-900 mb-4">Client to Company</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Paid Amount</span>
                          <span className="font-medium">₹{projectStatus[selectedProject.project_id]?.paidAmount || '0.00'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Status</span>
                          <span className={`font-medium ${projectStatus[selectedProject.project_id]?.isComplete ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {projectStatus[selectedProject.project_id]?.isComplete ? 'Completed' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-900 mb-4">Company to Students</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Paid Amount</span>
                          <span className="font-medium">₹{studentPaymentStatus[selectedProject.project_id]?.paidAmount || '0.00'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Status</span>
                          <span className={`font-medium ${studentPaymentStatus[selectedProject.project_id]?.isComplete ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {studentPaymentStatus[selectedProject.project_id]?.isComplete ? 'Completed' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Payment Status Message */}
        <AnimatePresence>
          {!selectedProject && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="rounded-xl p-4 shadow-md bg-amber-50 border border-amber-200"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
                <div className="text-sm">
                  <div className="font-medium">Please select a project to view status or add transactions.</div>
                </div>
              </div>
            </motion.div>
          )}
          {selectedProject && studentPaymentStatus[selectedProject?.project_id]?.isComplete && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="rounded-xl p-4 shadow-md bg-emerald-50 border border-emerald-200"
            >
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-500 mt-0.5" />
                <div className="text-sm">
                  <div className="font-medium">This project's payments have been fully transferred to students. No further payments required.</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Transaction Form or Completed Payment Details */}
        <AnimatePresence>
          {isFormOpen && selectedProject && (
            studentPaymentStatus[selectedProject.project_id]?.isComplete ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-emerald-50 rounded-xl shadow-lg border border-emerald-200 overflow-hidden"
              >
                <div className="p-4 sm:p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-emerald-900 flex items-center gap-2">
                      <Check className="w-5 h-5 text-emerald-600" />
                      Completed Transaction Details
                    </h2>
                  </div>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="text-sm text-gray-600">Project</div>
                        <div className="font-semibold">{formData.projectName}</div>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="text-sm text-gray-600">Client</div>
                        <div className="font-semibold">{formData.clientName}</div>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="text-sm text-gray-600">Total Amount</div>
                        <div className="font-semibold">₹{formData.totalAmount}</div>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="text-sm text-gray-600">Petty Cash</div>
                        <div className="font-semibold">₹{paidProjects[selectedProject.project_id]?.details.pettyCash}</div>
                      </div>
                      {paidProjects[selectedProject.project_id]?.details.pettyCashDescription && (
                        <div className="bg-white p-4 rounded-lg shadow-sm col-span-2">
                          <div className="text-sm text-gray-600">Petty Cash Remarks</div>
                          <div className="font-semibold">{paidProjects[selectedProject.project_id]?.details.pettyCashDescription}</div>
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-emerald-900 mb-4">Student Payments</h3>
                      <div className="space-y-4">
                        {paidProjects[selectedProject.project_id]?.details.students.map((student, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-lg p-4 shadow-sm"
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <div className="text-sm text-gray-600">Student</div>
                                <div className="font-semibold">{student.name}</div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-600">Amount</div>
                                <div className="font-semibold">₹{student.amount}</div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-600">From UPI</div>
                                <div className="font-mono text-sm">{student.fromUpiId}</div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-600">To UPI</div>
                                <div className="font-mono text-sm">{student.toUpiId}</div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-600">Transaction ID</div>
                                <div className="font-mono text-sm">{student.transactionId}</div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-600">Date & Time</div>
                                <div className="text-sm">{new Date(student.dateTime).toLocaleString()}</div>
                              </div>
                              {student.amountDescription && (
                                <div className="col-span-2">
                                  <div className="text-sm text-gray-600 mb-2">Amount Remarks</div>
                                  <div className="font-semibold">{student.amountDescription}</div>
                                </div>
                              )}
                              {student.transaction_screenshot && (
                                <div className="col-span-2">
                                  <div className="text-sm text-gray-600 mb-2">Transaction Proof</div>
                                  <FilePreview 
                                    fileUrl={`https://gig.kggeniuslabs.com/api/${student.transaction_screenshot}`} 
                                  />
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
              >
                <div className="p-4 sm:p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                      <PlusCircle className="w-5 h-5 text-emerald-600" />
                      Add Transaction
                      {expenseSubType && (
                        <span className="text-sm font-normal text-gray-500">({expenseType} - {expenseSubType})</span>
                      )}
                      {!expenseSubType && expenseType && (
                        <span className="text-sm font-normal text-gray-500">({expenseType})</span>
                      )}
                    </h2>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={resetForm}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-5 h-5" />
                    </motion.button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Expense Type</label>
                        <Select
                          options={expenseTypeOptions}
                          onChange={handleSelectExpenseType}
                          placeholder="Select Expense Type"
                          className="text-sm"
                          isSearchable
                          isDisabled={isFormDisabled}
                          menuPortalTarget={document.body}
                          styles={{
                            menuPortal: base => ({ ...base, zIndex: 9999 }),
                            control: (base) => ({
                              ...base,
                              minHeight: '44px',
                              borderRadius: '0.5rem',
                              borderColor: '#e5e7eb',
                              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                              '&:hover': {
                                borderColor: '#10b981',
                              },
                            }),
                            option: (base, { isFocused, isSelected }) => ({
                              ...base,
                              backgroundColor: isSelected ? '#10b981' : isFocused ? '#e0f2fe' : 'white',
                              color: isSelected ? 'white' : '#1f2937',
                              '&:active': {
                                backgroundColor: '#10b981',
                                color: 'white',
                              },
                            }),
                          }}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
                        <input
                          type="text"
                          name="clientName"
                          value={formData.clientName}
                          onChange={handleInputChange}
                          className={`w-full rounded-lg border-gray-300 shadow-sm text-sm py-3 px-4 ${
                            isFormDisabled ? 'bg-gray-100 cursor-not-allowed' : 'focus:border-emerald-500 focus:ring-emerald-500'
                          }`}
                          placeholder="Enter client name"
                          required
                          disabled={isFormDisabled}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Team Size</label>
                        <input
                          type="number"
                          name="teamSize"
                          value={formData.teamSize}
                          onChange={handleInputChange}
                          className={`w-full rounded-lg border-gray-300 shadow-sm text-sm py-3 px-4 ${
                            isFormDisabled ? 'bg-gray-100 cursor-not-allowed' : 'focus:border-emerald-500 focus:ring-emerald-500'
                          }`}
                          placeholder="Enter number of students"
                          required
                          disabled={isFormDisabled}
                          min="1"
                        />
                      </div>

                      <div className="flex items-end gap-2">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Petty Cash (₹)</label>
                          <input
                            type="number"
                            name="pettyCash"
                            value={formData.pettyCash}
                            onChange={handleInputChange}
                            readOnly={!editableFields.pettyCash}
                            className={`w-full rounded-lg border-gray-300 shadow-sm text-sm py-3 px-4 ${
                              !editableFields.pettyCash || isFormDisabled
                                ? 'bg-gray-100 cursor-not-allowed'
                                : 'focus:border-emerald-500 focus:ring-emerald-500'
                            }`}
                            placeholder="Enter petty cash amount"
                            required
                            disabled={isFormDisabled}
                            min="0"
                            step="0.01"
                          />
                        </div>
                        {!isFormDisabled && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            type="button"
                            onClick={() => toggleEditableField('pettyCash')}
                            className="mb-1 p-2 text-gray-500 hover:text-emerald-600"
                          >
                            <Edit className="w-5 h-5" />
                          </motion.button>
                        )}
                      </div>
                      {modifiedFields.pettyCash && (
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Petty Cash Remarks</label>
                          <textarea
                            name="pettyCashDescription"
                            value={formData.pettyCashDescription}
                            onChange={handleInputChange}
                            className={`w-full rounded-lg border-gray-300 shadow-sm text-sm py-3 px-4 ${
                              isFormDisabled ? 'bg-gray-100 cursor-not-allowed' : 'focus:border-emerald-500 focus:ring-emerald-500'
                            }`}
                            placeholder="Reason for modifying the petty cash amount"
                            rows="3"
                            disabled={isFormDisabled}
                          />
                        </div>
                      )}
                    </div>

                    {formData.students.length > 0 && (
                      <div className="border-t pt-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Student Payments</h3>
                        <div className="space-y-4">
                          {formData.students.map((student, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="border rounded-lg p-4 bg-gray-50 shadow-sm"
                            >
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Student {index + 1}</label>
                                  <select
                                    value={student.studentId}
                                    onChange={(e) => handleStudentInputChange(index, 'studentId', e.target.value)}
                                    className={`w-full rounded-lg border-gray-300 shadow-sm text-sm py-3 px-4 ${
                                      isFormDisabled ? 'bg-gray-100 cursor-not-allowed' : 'focus:border-emerald-500 focus:ring-emerald-500'
                                    }`}
                                    required
                                    disabled={isFormDisabled}
                                  >
                                    <option value="">Select Student</option>
                                    {students.map((s) => (
                                      <option key={s.student_id} value={s.student_id}>
                                        {s.name} ({s.roll_no})
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <div className="flex items-end gap-2">
                                  <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                                    <input
                                      type="number"
                                      value={student.amount}
                                      onChange={(e) => handleStudentInputChange(index, 'amount', e.target.value)}
                                      readOnly={!editableFields[`student-${index}`]}
                                      className={`w-full rounded-lg border-gray-300 shadow-sm text-sm py-3 px-4 ${
                                        !editableFields[`student-${index}`] || isFormDisabled
                                          ? 'bg-gray-100 cursor-not-allowed'
                                          : 'focus:border-emerald-500 focus:ring-emerald-500'
                                      }`}
                                      placeholder="Enter amount"
                                      required
                                      disabled={isFormDisabled}
                                      min="0"
                                      step="0.01"
                                    />
                                  </div>
                                  {!isFormDisabled && (
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      type="button"
                                      onClick={() => toggleEditableField(`student-${index}`)}
                                      className="mb-1 p-2 text-gray-500 hover:text-emerald-600"
                                    >
                                      <Edit className="w-5 h-5" />
                                    </motion.button>
                                  )}
                                </div>
                                {modifiedFields[`student-${index}`] && (
                                  <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount Remarks</label>
                                    <textarea
                                      value={student.amountDescription}
                                      onChange={(e) => handleStudentInputChange(index, 'amountDescription', e.target.value)}
                                      className={`w-full rounded-lg border-gray-300 shadow-sm text-sm py-3 px-4 ${
                                        isFormDisabled ? 'bg-gray-100 cursor-not-allowed' : 'focus:border-emerald-500 focus:ring-emerald-500'
                                      }`}
                                      placeholder="Reason for modifying the amount"
                                      rows="3"
                                      disabled={isFormDisabled}
                                    />
                                  </div>
                                )}
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">From UPI ID</label>
                                  <input
                                    type="text"
                                    value={student.fromUpiId}
                                    onChange={(e) => handleStudentInputChange(index, 'fromUpiId', e.target.value)}
                                    className={`w-full rounded-lg border-gray-300 shadow-sm text-sm py-3 px-4 ${
                                      isFormDisabled ? 'bg-gray-100 cursor-not-allowed' : 'focus:border-emerald-500 focus:ring-emerald-500'
                                    }`}
                                    placeholder="admin@upi"
                                    required
                                    disabled={isFormDisabled}
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">To UPI ID</label>
                                  <input
                                    type="text"
                                    value={student.toUpiId}
                                    onChange={(e) => handleStudentInputChange(index, 'toUpiId', e.target.value)}
                                    className={`w-full rounded-lg border-gray-300 shadow-sm text-sm py-3 px-4 ${
                                      isFormDisabled ? 'bg-gray-100 cursor-not-allowed' : 'focus:border-emerald-500 focus:ring-emerald-500'
                                    }`}
                                    placeholder="student@upi"
                                    required
                                    disabled={isFormDisabled}
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID/UTR</label>
                                  <input
                                    type="text"
                                    value={student.transactionId}
                                    onChange={(e) => handleStudentInputChange(index, 'transactionId', e.target.value)}
                                    className={`w-full rounded-lg border-gray-300 shadow-sm text-sm py-3 px-4 ${
                                      isFormDisabled ? 'bg-gray-100 cursor-not-allowed' : 'focus:border-emerald-500 focus:ring-emerald-500'
                                    }`}
                                    placeholder="Enter transaction ID"
                                    required
                                    disabled={isFormDisabled}
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                                  <DatePicker
                                    selected={student.dateTime}
                                    onChange={(date) => handleStudentDateChange(index, date)}
                                    showTimeSelect
                                    dateFormat="Pp"
                                    className={`w-full rounded-lg border-gray-300 shadow-sm text-sm py-3 px-4 ${
                                      isFormDisabled ? 'bg-gray-100 cursor-not-allowed' : 'focus:border-emerald-500 focus:ring-emerald-500'
                                    }`}
                                    required
                                    disabled={isFormDisabled}
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Proof</label>
                                  <input
                                    type="file"
                                    onChange={(e) => handleStudentFileChange(index, e)}
                                    className={`w-full text-sm text-gray-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 ${
                                      isFormDisabled ? 'cursor-not-allowed' : ''
                                    }`}
                                    accept="image/*,.pdf"
                                    required
                                    disabled={isFormDisabled}
                                  />
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {isFormDisabled ? (
                      <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-lg">
                        <div className="font-medium">
                          Awaiting full payment from the client.
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-end">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="submit"
                          className="bg-emerald-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-emerald-700 flex items-center gap-2"
                        >
                          <PlusCircle className="w-5 h-5" />
                          Record Transaction
                        </motion.button>
                      </div>
                    )}
                  </form>
                </div>
              </motion.div>
            )
          )}
        </AnimatePresence>

        {/* Transaction History */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
        >
          <div className="p-4 sm:p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              Transaction History
            </h2>

            {sortedTransactions.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">No transactions recorded yet</div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsFormOpen(true)}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto"
                  disabled={isFormDisabled}
                >
                  <PlusCircle className="w-4 h-4" />
                  Add First Transaction
                </motion.button>
              </div>
            ) : (
              <div className="space-y-6">
                {sortedTransactions.map((transaction) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`${projectColorMap[transaction.project_name]} rounded-lg p-4 shadow-sm`}
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {transaction.project_name} - {transaction.client_name}
                        </h3>
                        <div className="text-sm text-gray-600">
                          Recorded by: {transaction.created_by_name} on {new Date(transaction.created_at).toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm">
                          <span className="font-medium">Expense Type: </span>
                          {transaction.expense_type === 'Operational Payment' && transaction.expense_subtype
                            ? `${transaction.expense_type} - ${transaction.expense_subtype}`
                            : transaction.expense_type}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Petty Cash: </span>
                          ₹{parseFloat(transaction.petty_cash).toFixed(2)}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Students: </span>
                          {(typeof transaction.student_details === 'string'
                            ? JSON.parse(transaction.student_details)
                            : transaction.student_details).length}
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => showTransactionDetails(transaction)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-sm flex items-center gap-2 hover:bg-blue-800"
                        >
                          <Eye className="w-4 h-4" />
                          {/* View Details */}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Full-Screen Transaction Modal */}
        <AnimatePresence>
          {isModalOpen && selectedTransaction && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <FullScreenTransactionModal
                transaction={selectedTransaction}
                studentDetails={selectedTransaction.studentDetails}
                onClose={() => setIsModalOpen(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PayableLedger;