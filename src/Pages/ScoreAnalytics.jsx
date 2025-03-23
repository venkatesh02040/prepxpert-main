import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,    
    BarElement,     
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { FaMicrophone, FaChartBar, FaLaptopCode, FaTrophy, FaRedo } from "react-icons/fa";
import "./ScoreAnalytics.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ScoreAnalytics = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [scores, setScores] = useState({
        communication: 0,
        aptitude: 0,
        technical: 0,
        overall: 0,
    });
    const [totalMarks, setTotalMarks] = useState({
        communication: 100,
        aptitude: 100,
        technical: 100,
        overall: 300,
    });

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("token");
    
        if (storedUser) {
            setUser(storedUser);
    
            const fetchScores = async () => {
                try {
                    const response = await fetch(`https://prep-backend.onrender.com/api/users/${storedUser.id}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                        }
                    });
                    if (!response.ok) throw new Error("Failed to fetch scores");
    
                    const data = await response.json();
    
                    // Fetch total questions dynamically
                    //⚠️⚠️⚠️visit "public\questions\totalQuestions.json" and change number of questions if increased.at present i have 10 questions per section.
                    const totalQuestionsResponse = await fetch("/questions/totalQuestions.json");
                    const totalQuestionsData = await totalQuestionsResponse.json();
    
                    const communicationTotal = totalQuestionsData.communication * 10;
                    const aptitudeTotal = totalQuestionsData.aptitude * 10;
                    const technicalTotal = totalQuestionsData.technical * 10;
                    const overallTotal = communicationTotal + aptitudeTotal + technicalTotal;
    
                    setTotalMarks({
                        communication: communicationTotal,
                        aptitude: aptitudeTotal,
                        technical: technicalTotal,
                        overall: overallTotal,
                    });
    
                    if (data) {
                        const communicationPercentage = (data.communication_score / communicationTotal) * 100 || 0;
                        const aptitudePercentage = (data.aptitude_score / aptitudeTotal) * 100 || 0;
                        const technicalPercentage = (data.technical_score / technicalTotal) * 100 || 0;
    
                        const overallPercentage = (communicationPercentage + aptitudePercentage + technicalPercentage) / 3; // ✅ Corrected
    
                        setScores({
                            communication: communicationPercentage,
                            aptitude: aptitudePercentage,
                            technical: technicalPercentage,
                            overall: overallPercentage,
                        });
                    }
                } catch (error) {
                    console.error("Error fetching user scores:", error);
                }
            };
    
            fetchScores();
        }
    }, []);
    
        const handleRetakeTest = async () => {
        if (!user) return;

        const updatedUser = {
            ...user,
            communication_score: 0,
            aptitude_score: 0,
            technical_score: 0,
            overall_score: 0,
        };

        localStorage.setItem("user", JSON.stringify(updatedUser));

        try {
            const response = await fetch(`https://prep-backend.onrender.com/api/users/${user.id}/score`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    communication_score: 0,
                    aptitude_score: 0,
                    technical_score: 0,
                    overall_score: 0,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to reset scores in database");
            }

            navigate(`/assessment/${user.name}`);
        } catch (error) {
            console.error("Error resetting scores:", error);
        }
    };

    return (
        <div className="score-analytics-container">
            <h2 style={{ color: "white", marginTop: "1.4rem" }}>Your Test Analytics</h2>

            <div className="score-section">
                <p><strong><FaMicrophone /> Communication Score:</strong> {scores.communication.toFixed(2)}%</p>
                <p><strong><FaChartBar /> Aptitude Score:</strong> {scores.aptitude.toFixed(2)}%</p>
                <p><strong><FaLaptopCode /> Technical Score:</strong> {scores.technical.toFixed(2)}%</p>
                <p className="overall-score" style={{ color: "#6372ff" }}><strong><FaTrophy /> Overall Score:</strong> {scores.overall.toFixed(2)}%</p>
            </div>

            <div className="chart-container">
                <Bar style={{ cursor: "pointer" }}
                    data={{
                        labels: ["Communication", "Aptitude", "Technical", "Overall"],
                        datasets: [
                            {
                                label: "Scores (%)",
                                data: [scores.communication, scores.aptitude, scores.technical, scores.overall],
                                backgroundColor: ["#4285F4", "#FBBC05", "#34A853", "#EA4335"],
                                borderRadius: 8,
                                barThickness: 50,
                            },
                        ],
                    }}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: false },
                            title: {
                                display: true,
                                text: "Test Performance",
                                font: { size: 16 },
                                color: "#333",
                            },
                        },
                        scales: {
                            x: {
                                title: { display: true, text: "Categories", font: { size: 14 } },
                                grid: { display: false },
                            },
                            y: {
                                beginAtZero: true,
                                max: 100,
                                title: { display: true, text: "Percentage (%)", font: { size: 14 } },
                                ticks: { stepSize: 10, font: { size: 12 } },
                            },
                        },
                    }}
                />
            </div>

            <button className="improve-btn" onClick={handleRetakeTest}>
                <FaRedo className="btn-icon" /> Improve
            </button>
        </div>
    );
};

export default ScoreAnalytics;
