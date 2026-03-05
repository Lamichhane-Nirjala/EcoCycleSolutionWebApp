import { useNavigate } from "react-router-dom";

const BackButton = ({ label = "← Back" }) => {
  const navigate = useNavigate();
  return (
    <button 
      onClick={() => navigate(-1)}
      style={{
        padding: "8px 16px",
        backgroundColor: "#f0f0f0",
        border: "1px solid #ddd",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "14px",
      }}
    >
      {label}
    </button>
  );
};

export default BackButton;
