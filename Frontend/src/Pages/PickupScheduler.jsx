import { useState } from "react";
import "../style/PickupScheduler.css";

export default function PickupScheduler() {

  const [date,setDate] = useState("");
  const [time,setTime] = useState("");
  const [wasteType,setWasteType] = useState("");

  const handlePickup = async () => {

    const token = localStorage.getItem("token");

    if(!date || !time || !wasteType){
      alert("Please fill all fields");
      return;
    }

    try{

      const res = await fetch("http://localhost:5000/api/pickup/schedule",{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          Authorization:`Bearer ${token}`
        },
        body:JSON.stringify({
          date,
          time,
          wasteType
        })
      });

      const data = await res.json();

      if(data.success){
        alert("Pickup scheduled successfully");
      }else{
        alert("Failed to schedule pickup");
      }

    }catch(err){
      console.error(err);
    }

  }

  return(

    <div className="pickupCard">

      <h3>Schedule Waste Pickup</h3>

      <div className="pickupForm">

        <input
        type="date"
        value={date}
        onChange={(e)=>setDate(e.target.value)}
        />

        <input
        type="time"
        value={time}
        onChange={(e)=>setTime(e.target.value)}
        />

        <select
        value={wasteType}
        onChange={(e)=>setWasteType(e.target.value)}
        >

          <option value="">Select Waste</option>
          <option value="Plastic">Plastic</option>
          <option value="Paper">Paper</option>
          <option value="Glass">Glass</option>
          <option value="Organic">Organic</option>
          <option value="Metal">Metal</option>

        </select>

        <button onClick={handlePickup}>
          Schedule Pickup
        </button>

      </div>

    </div>

  )

}