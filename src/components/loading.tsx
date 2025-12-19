import React from "react";
import loadingImg from "../images/loading_img.jpg"; // adjust path
import "../styles/Loading.css";

const Loading: React.FC = () => {
  return (
    <div className="loading-container">
      <div className="ring">
        <img src={loadingImg} alt="Loading..." className="loading-image" />
      </div>
    </div>
  );
};

export default Loading;
