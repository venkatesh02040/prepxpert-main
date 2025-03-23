import React from "react";
import "./FooterContent.css";

const FooterContent = ({ dispatch, totalQuestions, index }) => {
  return (
    <>
      {index < totalQuestions ? (
        <button className="f-btn" onClick={() => dispatch({ type: "nextQuestions" })}>
          Next
        </button>
      ) : (
        <button className="f-btn" onClick={() => dispatch({ type: "finishScreen" })}>
          Finish
        </button>
      )}
    </>
  );
};

export default FooterContent;



