// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

// const COLORS = ["#00C49F", "#FFBB28", "#FF8042"];

// const DoughnutPieChart = () => {
//   const [clg, setClg] = useState([]);

//   useEffect(() => {
//     axios.get(`http://localhost:5000/admin/college`).then((res) => {
//       setClg(res.data.msg);
//     });
//   }, []);

//   return (
//     <div className="flex justify-center">
//       <PieChart width={400} height={400}>
//         <Pie
//           data={clg}
//           cx={200}
//           cy={200}
//           innerRadius={60}
//           outerRadius={80}
//           fill="#8884d8"
//           paddingAngle={5}
//           dataKey="value"
//         >
//           {clg.map((entry, index) => (
//             <Cell
//               key={`cell-${index}`}
//               fill={COLORS[index % COLORS.length]}
//               label={null}
//             />
//           ))}
//         </Pie>
//         <Tooltip />
//         <Legend />
//       </PieChart>
//     </div>
//   );
// };

// export default DoughnutPieChart;



import axios from "axios";
import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";


const COLORS = ["#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#FF69B4"];


const PieChartComponent = () => {
  const [clg, setClg] = useState([]);


  useEffect(() => {
    axios.get(`http://localhost:5000/admin/college`).then((res) => {
      setClg(res.data.msg);
    });
  }, []);


  // Custom Legend formatter
  const renderLegendText = (value, entry) => {
    const found = clg.find((item) => item.name === value);
    return `${value}: ${found ? found.value : 0}`;
  };


  return (
    <div className="flex justify-center">
      <PieChart width={400} height={400}>
        <Pie
          data={clg}
          cx={200}
          cy={200}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
          nameKey="name"
          label
        >
          {clg.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend
          formatter={renderLegendText}
          iconType="circle"
          layout="vertical"
          align="right"
          verticalAlign="middle"
        />
      </PieChart>
    </div>
  );
};


export default PieChartComponent;