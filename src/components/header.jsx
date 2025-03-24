import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
export const Header = (props) => {

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
    <header id="header">
      <div className="intro">
        <div className="overlay">
          <div className="container">
            <div className="row">
              <div className="col-md-8 col-md-offset-2 intro-text" id="home">
                <h1>
                  {props.data ? props.data.title : "Loading"}
                  <span></span>
                </h1>
                <p>{props.data ? props.data.paragraph : "Loading"}</p>
                <button onClick={handleNavigate} className="btn btn-custom btn-lg page-scroll">
                  Start Your Journey
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
