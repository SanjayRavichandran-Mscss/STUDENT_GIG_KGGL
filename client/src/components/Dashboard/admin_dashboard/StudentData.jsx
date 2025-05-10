import axios from "axios";
import React, { useEffect, useState } from "react";

function StudentsData() {
  const [testdata, setTestdata] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/admin/studata").then((res) => {
      setTestdata(res.data.result);
    });
  }, []);

  return (
    <div className="p-4">
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Degree</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {testdata.map((value) => (
            <tr key={value.student_id} className="hover:bg-gray-50">
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{value.student_id}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{value.name}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{value.email}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{value.degree}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{value.specialization}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{value.year}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentsData;