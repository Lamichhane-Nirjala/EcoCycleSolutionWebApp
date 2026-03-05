import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

import "../style/WasteChart.css";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function WasteChart() {

  const [chartData, setChartData] = useState(null);

  useEffect(() => {

    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/waste/analytics", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {

        setChartData({
          labels: ["Plastic", "Paper", "Glass", "Organic"],
          datasets: [
            {
              label: "Waste Distribution",
              data: [
                data.plastic || 0,
                data.paper || 0,
                data.glass || 0,
                data.organic || 0
              ],
              backgroundColor: [
                "#4caf50",
                "#2196f3",
                "#ff9800",
                "#8bc34a"
              ]
            }
          ]
        });

      })
      .catch(err => console.error(err));

  }, []);

  if (!chartData) return <p>Loading chart...</p>;

  return (
    <div className="chartCard">
      <h3>Waste Analytics</h3>
      <Pie data={chartData} />
    </div>
  );
}