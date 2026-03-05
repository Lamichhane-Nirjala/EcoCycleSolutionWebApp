import React,{useEffect,useState} from "react";

export default function Leaderboard(){

  const [leaders,setLeaders] = useState([]);

  useEffect(()=>{

    fetch("http://localhost:5000/api/leaderboard")
    .then(res=>res.json())
    .then(data=>{
      setLeaders(data);
    })
    .catch(err=>console.log(err))

  },[])

  return(

    <div className="card">

      <h3>Top Eco Warriors</h3>

      {leaders.map((user,index)=>(
        <p key={user.id}>
          {index+1}. {user.name} — {user.points} pts
        </p>
      ))}

    </div>

  )

}