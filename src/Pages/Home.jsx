import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.name) {
      setUser(storedUser);
    } else {
      navigate("/start-your-journey");
    }
  }, [navigate]);

  const handleStartAssessment = async () => {
    if (!user) return;

    const updatedUser = {
      ...user,
      communication_score: 0,
      aptitude_score: 0,
      technical_score: 0,
      overall_score: 0,
    };

    try {
      const response = await fetch(`https://prep-backend.onrender.com/api/users/${user.id}/score`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          communication_score: 0,
          aptitude_score: 0,
          technical_score: 0,
          overall_score: 0,
        }),
      });

      if (!response.ok) throw new Error("Failed to reset scores in database");

      localStorage.setItem("user", JSON.stringify(updatedUser));

      navigate(`/assessment/${user.name}`);
    } catch (error) {
      console.error("Error resetting scores:", error);
    }
  };

  return (
    <div className="home-container">
      <div className="banner">
        <div className="banner-content">
          <h2>Welcome to PrepXpert</h2>
          <p>
            Enhance your skills with our interactive assessments and detailed
            analytics. Prepare yourself for upcoming challenges!
          </p>
          <button className="start-assessment-btn" onClick={handleStartAssessment}>
            Start Assessment
          </button>
        </div>
      </div>
      <h2 className="welcome-message">Welcome, {user?.name}!</h2>
    </div>
  );
};

export default Home;
