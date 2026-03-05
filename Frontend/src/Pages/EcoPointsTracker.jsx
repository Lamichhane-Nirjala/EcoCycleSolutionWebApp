import { useEffect, useState } from "react";
import "../style/EcoPointTracker.css";

export default function EcoPointsTracker(){

  const [points,setPoints] = useState(0);
  const [loading,setLoading] = useState(true);

  useEffect(()=>{

    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/rewards/points",{
      headers:{
        Authorization:`Bearer ${token}`
      }
    })
    .then(res=>res.json())
    .then(data=>{

      setPoints(data.points || 0);
      setLoading(false);

    })
    .catch(err=>{
      console.error(err);
      setLoading(false);
    });

  },[]);

  if(loading){
    return <div className="pointsCard">Loading points...</div>;
  }

  const nextReward = 500;
  const progress = Math.min((points/nextReward)*100,100);

  return(

    <div className="pointsCard">

      <h3>Eco Points</h3>

      <h1>{points}</h1>

      <p>{nextReward - points} points to next reward</p>

      <div className="progressBar">

        <div
          className="progressFill"
          style={{width:`${progress}%`}}
        />

      </div>

      <div className="rewardHint">

        🎁 Next Reward: Eco Bag

      </div>

    </div>

  )

}