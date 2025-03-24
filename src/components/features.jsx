import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Features = (props) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleNavigate = () => {
    setLoading(true); 

    setTimeout(() => {
      setLoading(false); 
      navigate("/start-your-journey"); 
    }, 1000);
  };

  return (
    <div id="features" className="text-center">
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
      <div className="container">
        <div className="col-md-10 col-md-offset-1 section-title" style={{ marginTop: "100px" }}>
          <h2>Why Prepxpert</h2>
        </div>
        <div className="row" id="fd">
          {props.data
            ? props.data.map((d, i) => (
                <div key={`${d.title}-${i}`} className="col-xs-6 col-md-3" id="lc" style={{ cursor: "pointer" }}>
                  <i className={d.icon}></i>
                  <h3>{d.title}</h3>
                  <p>{d.text}</p>
                </div>
              ))
            : "Loading..."}
        </div>
        <br />
        <button onClick={handleNavigate} className="btn btn-custom btn-lg page-scroll">
         Take Your Test Now
        </button>
      </div>
    </div>
  );
};
