import { useEffect, useState } from "react";
import "../style/RecentActivity.css";

export default function RecentActivity() {

  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/waste/activity", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setActivity(data.activities || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });

  }, []);

  if (loading) {
    return (
      <div className="activityCard">
        <h3>Recent Activity</h3>
        <p>Loading activity...</p>
      </div>
    );
  }

  return (

    <div className="activityCard">

      <h3>Recent Recycling</h3>

      {activity.length === 0 ? (

        <p>No recycling activity yet</p>

      ) : (

        <table>

          <thead>

            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Weight</th>
              <th>Status</th>
            </tr>

          </thead>

          <tbody>

            {activity.map((item, index) => (

              <tr key={index}>

                <td>{item.date}</td>

                <td>{item.type}</td>

                <td>{item.weight} kg</td>

                <td className={item.status === "Completed" ? "done" : "pending"}>
                  {item.status}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      )}

    </div>

  );
}