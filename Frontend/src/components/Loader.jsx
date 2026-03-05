import React from "react";
import "./Loader.css";

export const Spinner = ({ size = "md", color = "#4ade80" }) => {
  return <div className={`spinner spinner-${size}`} style={{ borderTopColor: color }} />;
};

export const LoadingPage = ({ message = "Loading..." }) => {
  return (
    <div className="loading-page">
      <Spinner size="lg" />
      <p>{message}</p>
    </div>
  );
};

export const Skeleton = ({ width = "100%", height = "20px", count = 1 }) => {
  return (
    <>
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className="skeleton"
            style={{ width, height }}
          />
        ))}
    </>
  );
};

export default Spinner;
