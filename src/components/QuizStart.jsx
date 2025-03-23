import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import "./QuizStart.css";
import FooterContent from './FooterContent';

const QuizStart = ({ dispatch, questions, totalQuestions, index, answer, timeLeft, totalTimeLeft }) => {
    const isTimeUp = timeLeft <= 0;

    const [userId, setUserId] = useState(null);
    const [userScores, setUserScores] = useState({
        communication_score: 0,
        aptitude_score: 0,
        technical_score: 0,
        overall_score: 0
    });
    const [hasAnswered, setHasAnswered] = useState(false);
    const [testCompleted, setTestCompleted] = useState(false);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUserId(storedUser.id);
            setUserScores({
                communication_score: storedUser.communication_score || 0,
                aptitude_score: storedUser.aptitude_score || 0,
                technical_score: storedUser.technical_score || 0,
                overall_score: storedUser.overall_score || 0
            });
        }
    }, []);

    useEffect(() => {
        setHasAnswered(false);
    }, [index]);

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            event.preventDefault();
            event.returnValue = "Are you sure you want to leave the quiz? Your progress will be lost.";
            window.location.href = "/dashboard"; 
        };
    
        window.addEventListener("beforeunload", handleBeforeUnload);
    
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);

    useEffect(() => {
        const handlePopState = () => {
            window.history.pushState(null, "", window.location.href);
            message.warning("You cannot navigate away during the quiz!", 2);
            window.location.href = "/dashboard"; 
        };
    
        window.history.pushState(null, "", window.location.href);
        window.addEventListener("popstate", handlePopState);
    
        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, []);

    const formatTime = (time) => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = time % 60;
        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    };

    const updateScore = async (updatedScores) => {
        try {
            const storedUser = JSON.parse(localStorage.getItem("user")) || {};
            if (!storedUser.id) { 
                console.error("User ID is missing from localStorage.");
                return;
            }

            const apiUrl = `https://prep-backend.onrender.com/api/users/${storedUser.id}/score`;

            const response = await fetch(apiUrl, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`, 
                },
                body: JSON.stringify(updatedScores),
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(`Failed to update score. Status: ${response.status}, Message: ${result.message}`);
            }

        } catch (error) {
            console.error("Error updating score:", error);
        }
    };


    const handleOptionClick = (idx) => {
        if (!isTimeUp && !hasAnswered) {
            setHasAnswered(true);
            dispatch({ type: "newAnswer", payload: idx });
    
            const isCorrect = questions.correctOption === idx;
            const updatedScores = { ...userScores };
    
            if (questions.category === "communication") {
                updatedScores.communication_score += isCorrect ? 10 : 0;
            } else if (questions.category === "aptitude") {
                updatedScores.aptitude_score += isCorrect ? 10 : 0;
            } else if (questions.category === "technical") {
                updatedScores.technical_score += isCorrect ? 10 : 0;
            }
    
            updatedScores.overall_score = updatedScores.communication_score + updatedScores.aptitude_score + updatedScores.technical_score;
    
            const storedUser = JSON.parse(localStorage.getItem("user")) || {};
            storedUser.communication_score = updatedScores.communication_score;
            storedUser.aptitude_score = updatedScores.aptitude_score;
            storedUser.technical_score = updatedScores.technical_score;
            storedUser.overall_score = updatedScores.overall_score;
    
            localStorage.setItem("user", JSON.stringify(storedUser));
    
            setUserScores(updatedScores);
    
            updateScore(updatedScores);
        }
    };
    
    return (
        <div className='quizstart-container'>
            <div className='quizstart-header'>
                <h2>{questions.question}</h2>
                <p className="quizstart-timer total-time">Total Time Left: {formatTime(totalTimeLeft)}</p>
                <p className="quizstart-timer question-time">Question Time Left: {formatTime(timeLeft)}</p>
            </div>
            <ul className='quizstart-body'>
                {questions.options.map((option, idx) => (
                    <li key={option}
                        onClick={() => handleOptionClick(idx)}
                        className={`quizstart-option ${isTimeUp ? "disabled" : ""} ${answer === idx ? "selected" : ""}`}
                    >
                        {option}
                    </li>
                ))}
            </ul>
            <div className="quizstart-footer">
                <p><strong>Category:</strong> {questions.category}</p>
                <p>Number of questions: {index}/{totalQuestions}</p>
                <FooterContent dispatch={dispatch} index={index} totalQuestions={totalQuestions} testCompleted={testCompleted} />
            </div>

        </div>
    );
};

export default QuizStart;
