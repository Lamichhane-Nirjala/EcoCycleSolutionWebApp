import React, { useEffect, useState } from "react";
import "../style/WasteTracker.css";

export default function WasteTracker(){

  const [logs,setLogs] = useState([]);
  const [stats,setStats] = useState(null);
  const [loading,setLoading] = useState(true);

  useEffect(()=>{

    const token = localStorage.getItem("token");

    Promise.all([
      fetch("http://localhost:5000/api/waste/history",{
        headers:{ Authorization:`Bearer ${token}` }
      }),
      fetch("http://localhost:5000/api/waste/stats",{
        headers:{ Authorization:`Bearer ${token}` }
      })
    ])
    .then(async ([logsRes,statsRes])=>{

      const logsData = await logsRes.json();
      const statsData = await statsRes.json();

      setLogs(logsData.logs || []);
      setStats(statsData);

      setLoading(false);

    })
    .catch(err=>{
      console.error(err);
      setLoading(false);
    });

  },[]);

  if(loading){
    return <div className="tracker-page">Loading tracker...</div>;
  }

  return(

    <div className="tracker-page">

      <h1>Waste Tracker</h1>

      {/* STATS */}
      <div className="tracker-stats">

        <div className="tracker-card">
          <h3>Total Recycled</h3>
          <p>{stats?.total || 0} kg</p>
        </div>

        <div className="tracker-card">
          <h3>Plastic</h3>
          <p>{stats?.plastic || 0} kg</p>
        </div>

        <div className="tracker-card">
          <h3>Paper</h3>
          <p>{stats?.paper || 0} kg</p>
        </div>

        <div className="tracker-card">
          <h3>Organic</h3>
          <p>{stats?.organic || 0} kg</p>
        </div>

      </div>

      {/* HISTORY TABLE */}
      <div className="tracker-table">

        <h2>Submission History</h2>

        <table>

          <thead>
            <tr>
              <th>Date</th>
              <th>Waste Type</th>
              <th>Weight</th>
              <th>Points Earned</th>
            </tr>
          </thead>

          <tbody>

            {logs.length === 0 && (
              <tr>
                <td colSpan="4">No recycling records yet</td>
              </tr>
            )}

            {logs.map((log,index)=>(
              <tr key={index}>

                <td>{log.date}</td>
                <td>{log.waste_type}</td>
                <td>{log.weight} kg</td>
                <td>+{log.points}</td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

}