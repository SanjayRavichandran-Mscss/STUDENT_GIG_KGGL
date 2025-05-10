import React, { useEffect, useState } from "react";
import DoughnutPieChart from "./Barchart.jsx";
import Kgcas from "./Progress.jsx";
import axios from "axios";

const MainContent = () => {
  const [student, setStudent] = useState();

  useEffect(() => {
    axios.get("http://localhost:5000/admin/stucount").then((res) => {
      setStudent(res.data.result[0].total_students);
    });
  }, []);

  return (
    <div className="p-8">
      <div className="flex space-x-8">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Skill Based</h3>
          <div className="flex justify-center">
            <Kgcas />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">College Based</h3>
          <div className="flex justify-center">
            <DoughnutPieChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;