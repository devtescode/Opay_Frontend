import React from 'react';
import './SplashScreen.css'; // Create a CSS file for custom styles
import icon from "../../../../public/icons/opay.jpg"
// /icons/opay.jpg
const SplashScreen = () => {
  return (
    <div className="splash-container">
        
      <img src={icon} alt="Opay Logo" className="logo" />
      <h1>We are Beyond Banking</h1>
      <p>
        <small>
          Licensed by the <strong>CBN</strong> and insured by the <strong>NDIC</strong>
        </small>
      </p>
    </div>
  );
};

export default SplashScreen;
