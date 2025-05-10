import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Kgcas = () => {
  const [Data, setData] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/admin/skill`).then((res) => {
      setData(res.data.result);
    });
  }, []);

  const data = {
    labels: Data.map(e => e.skill_name),
    datasets: [
      {
        label: "Dataset",
        backgroundColor: "rgb(52, 138, 186)",
        borderColor: "rgba(0, 123, 255, 1)",
        borderWidth: 1,
        borderRadius: 5,
        data: Data.map(e => e.num_students_with_skill),
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        },
      },
    },
    elements: {
      bar: {
        borderWidth: 1,
        barThickness: 5,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="w-full max-w-md h-80">
      <Bar data={data} options={options} />
    </div>
  );
};

export default Kgcas;