import React,{useEffect,useState} from "react";
import "../style/Admin.css";

export default function AdminPickups(){

 const [pickups,setPickups] = useState([]);

 useEffect(()=>{

  const token = localStorage.getItem("token");

  fetch("http://localhost:5000/api/pickup/admin/all",{
   headers:{
    Authorization:`Bearer ${token}`
   }
  })
  .then(res=>res.json())
  .then(data=>{
   setPickups(data);
  });

 },[]);

 return(

  <div className="admin-dashboard">

   <h1>Pickup Management</h1>

   <table className="admin-table">

    <thead>
     <tr>
      <th>ID</th>
      <th>User</th>
      <th>Waste</th>
      <th>Weight</th>
      <th>Status</th>
     </tr>
    </thead>

    <tbody>

     {pickups.map(p=>(
      <tr key={p.id}>
       <td>{p.id}</td>
       <td>{p.userId}</td>
       <td>{p.wasteType}</td>
       <td>{p.weight}</td>
       <td>{p.status}</td>
      </tr>
     ))}

    </tbody>

   </table>

  </div>

 )

}