import React from "react";

export const Services = (props) => {
  return (
    <div id="services" className="text-center" style={{width:"100%"}}>
      <div className="container">
        <div className="section-title">
          <h2>Our Services</h2>
          <p>
            PrepXpert provides industry-aligned placement tests, detailed performance analysis,
            and skill enhancement resources to help candidates prepare effectively for their dream jobs.
          </p>
        </div>
        <div className="row" id="sd" style={{display:"flex",flexWrap:"wrap"}}>
          {props.data
            ? props.data.map((d, i) => (
              <div key={`${d.name}-${i}`} className="col-md-4" id="sc" style={{cursor:"pointer"}}>
                {" "}
                <i className={d.icon}></i>
                <div className="service-desc">
                  <h3>{d.name}</h3>
                  <p>{d.text}</p>
                </div>
              </div>
            ))
            : "loading"}
        </div>
      </div>
    </div>
  );
};
