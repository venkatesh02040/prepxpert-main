import React, { useEffect, useState } from 'react';
import { FaChartBar, FaRedo, FaHome } from "react-icons/fa"; 
import "./FinishScreen.css";

const FinishScreen = ({ dispatch }) => {
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUserId(storedUser.id);
        }
    }, []);

    const resetScores = async () => {
        const resetData = {
            communication_score: 0,
            aptitude_score: 0,
            technical_score: 0,
            overall_score: 0
        };

        try {
            if (!userId) {
                console.warn("⚠️ User ID not found, cannot reset scores.");
                return;
            }

            const response = await fetch(`https://prep-backend.onrender.com/api/users/${user._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(resetData)
            });

            if (!response.ok) throw new Error("Failed to reset scores");

            const storedUser = JSON.parse(localStorage.getItem("user")) || {};
            localStorage.setItem("user", JSON.stringify({ ...storedUser, ...resetData }));

            console.log("Scores reset successfully!");

            dispatch({ type: "restartQuiz" });

        } catch (error) {
            console.error("Error resetting scores:", error);
        }
    };

    return (
        <div className="finish-container">
            <h2>Quiz Completed!</h2>
            <p className="congrats-message">Well done! You have successfully completed the quiz.</p>

            <div className="btn-group">
                <button className="btn score-btn" onClick={() => window.location.href = "/dashboard/score-analytics"}>
                    <FaChartBar className="btn-icon" /> View Scores
                </button>
                <button className="btn restart-btn" onClick={resetScores}>
                    <FaRedo className="btn-icon" /> Restart Quiz
                </button>
                <button className="btn dashboard-btn" onClick={() => window.location.href = "/dashboard"}>
                    <FaHome className="btn-icon" /> Go to Dashboard
                </button>
            </div>
        </div>
    );
};

export default FinishScreen;
