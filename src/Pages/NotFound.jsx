import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
    return (
        <div className="notfound-container">
            <h1 className="notfound-title">Oops!</h1>
            <p className="notfound-subtitle">404 - PAGE NOT FOUND</p>
            <p className="notfound-text">
                We can't find the page you're looking for. You can either return to the previous page or visit our homepage.
            </p>
            <Link to="/" className="notfound-button">Go to Homepage</Link>
        </div>
    );
};

export default NotFound;
