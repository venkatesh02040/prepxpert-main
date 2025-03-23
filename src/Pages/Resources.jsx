import { useState } from "react";
import pdfData from "../data/pdfData";
import "./Resources.css";

const Resources = () => {
  const [showTechnical, setShowTechnical] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleNavigation = (section) => {
    if (section === "technical") {
      setShowTechnical(true);
    } else {
      triggerPdfDownload(pdfData[section]);
    }
  };

  const handleTechnicalSelection = (tech) => {
    const pdfUrl = pdfData.technical[tech.toLowerCase()];
    triggerPdfDownload(pdfUrl);
  };

  const triggerPdfDownload = (pdfUrl) => {
    if (pdfUrl) {
      setLoading(true);
      setTimeout(() => {
        window.open(pdfUrl, "_blank"); 
        setLoading(false);
      }, 1500); 
    }
  };

  return (
    <div className="resource-container">
      <h1 className="resource-title">Explore Our Learning Resources</h1>
      <p className="resource-description">
        Access valuable study materials for Communication, Aptitude, and Technical subjects. Enhance your skills and prepare effectively for assessments.
      </p>

      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
          <p style={{color:"white"}}>Loading ...</p>
        </div>
      ) : (
        <div className="card-container">
          {!showTechnical ? (
            <div className="card-row">
              <div className="card-item" onClick={() => handleNavigation("communication")}>
                <h2 style={{color:"color: #6372ff;"}}>Communication</h2>
              </div>
              <div className="card-item" onClick={() => handleNavigation("aptitude")}>
                <h2 style={{color:"color: #6372ff;"}}>Aptitude</h2>
              </div>
              <div className="card-item" onClick={() => handleNavigation("technical")}>
                <h2 style={{color:"color: #6372ff;"}}>Technical</h2>
              </div>
            </div>
          ) : (
            <>
              <button className="back-button" onClick={() => setShowTechnical(false)}>← Back</button>
              <div className="card-row" style={{color:"color: #6372ff;"}}>
                {["Java", "Python", "SQL", "Nodejs", "Frontend"].map((tech) => (
                  <div key={tech} className="card-item" onClick={() => handleTechnicalSelection(tech)}>
                    <h2>{tech}</h2>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Resources;
