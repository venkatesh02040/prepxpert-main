import React, { useEffect, useState } from "react";
import { Form, Input, Button, notification } from "antd";
import { useNavigate } from "react-router-dom";
import "./StartYourJourney.css";

const SIGNUP_URL = "https://prep-backend.onrender.com/api/auth/signup";
const LOGIN_URL = "https://prep-backend.onrender.com/api/auth/login";

const StartYourJourney = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const navigate = useNavigate();

  const showNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
      placement: "topRight",
      duration: 3,
    });
  };

  useEffect(() => {
    showNotification("info", "Welcome!", "Welcome to PrepXpert 🎉");
  }, []);

  const onSignUp = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const newUser = {
        name: values.name,
        email: values.email,
        password: values.password,
      };

      const response = await fetch(SIGNUP_URL, {
        method: "POST",   
        
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      const data = await response.json();

      if (response.ok) {
        showNotification("success", "Sign Up Successful!", "Please log in now.");
        form.resetFields();
      } else {
        showNotification("error", "Sign Up Failed", data.message || "Something went wrong.");
      }
    } catch (error) {
      showNotification("warning", "Incomplete Details", "Please fill in all required fields.");
    } finally {
      setLoading(false);
    }
  };

  const onLogin = async () => {
    try {
      const values = await form.validateFields(["email", "password"]);
      setLoginLoading(true);

      const userCredentials = {
        email: values.email,
        password: values.password,
      };

      const response = await fetch(LOGIN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userCredentials),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);

        showNotification("success", "Login Successful!", "Welcome back to PrepXpert.");
        navigate("/dashboard"); 
      } else {
        showNotification("error", "Login Failed", data.message || "Invalid credentials.");
      }
    } catch (error) {
      showNotification("warning", "Incomplete Details", "Please enter your email and password.");
    } finally {
      setLoginLoading(false);
    }
  };

  const onGuestLogin = async () => {
    try {
      setGuestLoading(true);

      const response = await fetch(LOGIN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "guest@gmail.com", password: "123456" }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);

        showNotification("success", "Logged in as Guest", "You are logged in as a guest.");
        navigate("/dashboard");
      } else {
        showNotification("error", "Guest Login Failed", data.message || "Guest login is not available.");
      }
    } catch (error) {
      showNotification("error", "Network Error", "Failed to login as guest. Please try again.");
    } finally {
      setGuestLoading(false);
    }
  };

  return (
    <div className="start-your-journey">
      <div className="image-container">
        <img src="/img/pimgL.jpeg" alt="Start Your Journey" className="journey-image" />
      </div>

      <div className="form-container">
        <h2 className="form-title">Welcome to PrepXpert</h2>
        <p>Sign up or log in to continue.</p>

        <Form form={form} layout="vertical" requiredMark={false}>
          <Form.Item
            label="Full Name"
            name="name"
            rules={[{ required: true, message: "Please enter your full name!" }]}
          >
            <Input placeholder="Enter your full name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email!" },
              { type: "email", message: "Enter a valid email!" },
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please enter your password!" },
              { min: 6, message: "Password must be at least 6 characters!" },
            ]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" block onClick={onSignUp} loading={loading}>
              Sign Up
            </Button>
          </Form.Item>

          <Form.Item>
            <Button type="default" block onClick={onLogin} loading={loginLoading}>
              Login
            </Button>
          </Form.Item>

          <Form.Item>
            <Button type="default" block onClick={onGuestLogin} loading={guestLoading}>
              Login as Guest
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default StartYourJourney;
