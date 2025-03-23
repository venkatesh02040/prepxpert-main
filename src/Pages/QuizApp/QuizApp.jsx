import React, { useEffect, useReducer, useState } from "react";
import { communicationQuestions } from "../../components/questions/communication";
import { aptitudeQuestions } from "../../components/questions/aptitude";
import { javaQuestions } from "../../components/questions/java";
import { pythonQuestions } from "../../components/questions/python";
import { sqlQuestions } from "../../components/questions/sql";
import { nodejsQuestions } from "../../components/questions/nodejs";
import { frontendQuestions } from "../../components/questions/frontend";
import StartScreen from "../../components/StartScreen";
import QuizStart from "../../components/QuizStart";
import FinishScreen from "./FinishScreen";
import "./QuizApp.css";

const technicalCategories = {
  Java: javaQuestions,
  Python: pythonQuestions,
  SQL: sqlQuestions,
  "Node.js": nodejsQuestions,
  Frontend: frontendQuestions,
};

function reducer(state, action) {
  switch (action.type) {
    case "category-selected":
      const selectedTechQuestions = technicalCategories[action.payload] || [];
      const combinedQuestions = [
        ...communicationQuestions,
        ...aptitudeQuestions,
        ...selectedTechQuestions,
      ];

      return {
        ...state,
        questions: combinedQuestions,
        status: "ready",
        index: 0,
        totalTimeLeft: combinedQuestions.length * 30, 
      };

    case "active":
      return { ...state, status: "active", timeLeft: 30 };

    case "newAnswer":
      const question = state.questions[state.index];
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };

    case "nextQuestions":
      if (state.index < state.questions.length - 1) {
        return {
          ...state,
          index: state.index + 1,
          answer: null,
          timeLeft: 30,
        };
      } else {
        return { ...state, status: "finish" };
      }

    case "finishScreen":
      return { ...state, status: "finish" };

    case "restart":
      return {
        ...initialState,
      };

    case "tick":
      if (state.timeLeft > 0) {
        return {
          ...state,
          timeLeft: state.timeLeft - 1,
          totalTimeLeft: state.totalTimeLeft - 1,
        };
      } else {
        return state.index < state.questions.length - 1
          ? { ...state, index: state.index + 1, timeLeft: 30, answer: null }
          : { ...state, status: "finish" };
      }

    default:
      return state;
  }
}

const initialState = {
  questions: [],
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  timeLeft: 30,
  totalTimeLeft: 0,
};

const QuizApp = () => {
  const [
    { status, questions, index, answer, points, timeLeft, totalTimeLeft },
    dispatch,
  ] = useReducer(reducer, initialState);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    if (status === "active" && timeLeft > 0 && totalTimeLeft > 0) {
      const timer = setInterval(() => {
        dispatch({ type: "tick" });
      }, 1000);

      return () => clearInterval(timer);
    }

    if (timeLeft === 0) {
      dispatch({
        type: index < questions.length - 1 ? "nextQuestions" : "finishScreen",
      });
    }
  }, [status, timeLeft, totalTimeLeft, questions.length, index]);

  return (
    <main className="quizapp-container">
      {status === "loading" && (
        <div className="quizapp-category-selection">
          <h2>Select a Technical Category</h2>
          {Object.keys(technicalCategories).map((category) => (
            <button
              key={category}
              className="quizapp-button"
              onClick={() => {
                setSelectedCategory(category);
                dispatch({ type: "category-selected", payload: category });
              }}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {status === "ready" && (
        <StartScreen
          dispatch={dispatch}
          totalQuestions={questions.length}
          maxPossiblePoints={questions.length * 10}
        />
      )}

      {status === "active" && questions.length > 0 && (
        <QuizStart
          questions={questions[index]}
          dispatch={dispatch}
          totalQuestions={questions.length}
          index={index + 1}
          answer={answer}
          timeLeft={timeLeft}
          totalTimeLeft={totalTimeLeft}
        />
      )}

      {status === "finish" && (
        <FinishScreen
          dispatch={() => {
            setSelectedCategory(""); 
            dispatch({ type: "restart" }); 
          }}
          maxPossiblePoints={questions.length * 10}
          points={points}
        />
      )}
    </main>
  );
};

export default QuizApp;
