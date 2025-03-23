import React from "react";
import { Steps, Button } from "antd";
import { RightOutlined, CheckCircleTwoTone } from "@ant-design/icons";
import "./StartScreen.css";

const { Step } = Steps;

const StartScreen = ({ dispatch, totalQuestions, maxPossiblePoints }) => {
  return (
    <div className="quiz_wrapper">
      <h3>Welcome to</h3>
      <h2>PrepXpert Assessment</h2>

      <Steps size="small" current={-1} className="assessment-steps">
        <Step title="Communication" icon={<RightOutlined />} />
        <Step title="Aptitude" icon={<RightOutlined />} />
        <Step title="Technical Category" icon={<RightOutlined />} />
        <Step title="Completed!" icon={<CheckCircleTwoTone twoToneColor="#52c41a" />} />
      </Steps>

      <p>Number of questions: {totalQuestions || "Loading..."}</p>
      <p>Total points: {maxPossiblePoints || "Calculating..."}</p>

      <Button type="primary" size="large" className="s-btn" onClick={() => dispatch({ type: "active" })}>
        Let's Start the Test
      </Button>
    </div>
  );
};

export default StartScreen;
