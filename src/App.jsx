import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Navigation } from "./components/navigation";
import { Header } from "./components/header";
import { Features } from "./components/features";
import { About } from "./components/about";
import { Services } from "./components/services";
import { Testimonials } from "./components/testimonials";
import { Contact } from "./components/contact";
import StartYourJourney from "./components/StartYourJourney/StartYourJourney";
import QuizApp from "./Pages/QuizApp/QuizApp";
import DashboardLayout from "./components/Dashboard/DashboardLayout";
import Home from "./Pages/Home";
import Profile from "./pages/Profile";
import ScoreAnalytics from "./pages/ScoreAnalytics";
import Resources from "./Pages/Resources";
import NotFound from "./Pages/NotFound";
import JsonData from "./data/data.json";
import SmoothScroll from "smooth-scroll";
import "./App.css";
import "antd/dist/reset.css";

export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});

const LoadingScreen = ({ loading }) => {
  return loading ? (
    <div className="loading-overlay">
      <div className="spinner"></div>
    </div>
  ) : null;
};

const AppContent = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timeout);
  }, [location.pathname]);

  return (
    <>
      <LoadingScreen loading={loading} />
      <Routes>
        {/* Landing Page Routes */}
        <Route
          path="/"
          element={
            <>
              <Navigation />
              <Header data={JsonData.Header} />
              <About data={JsonData.About} />
              <Services data={JsonData.Services} />
              <Features data={JsonData.Features} />
              <Testimonials data={JsonData.Testimonials} />
              <Contact data={JsonData.Contact} />
            </>
          }
        />
        <Route path="/start-your-journey" element={<StartYourJourney />} />

        {/* Dashboard Routes */}
        <Route path="/dashboard/*" element={<DashboardLayout />}>
          <Route index element={<Navigate to="home" />} />
          <Route path="home" element={<Home />} />
          <Route path="profile" element={<Profile />} />
          <Route path="score-analytics" element={<ScoreAnalytics />} />
          <Route path="resources" element={<Resources />} />
          <Route path="*" element={<NotFound />} /> 
        </Route>

        {/* Assessment Route with Dynamic Username */}
        <Route path="/assessment/:username" element={<QuizApp />} />

        {/* Default Redirect */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
