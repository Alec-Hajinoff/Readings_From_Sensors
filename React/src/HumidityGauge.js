// HumidityGauge.js
import React from "react";
import "./HumidityGauge.css"; // Create this CSS file

function HumidityGauge({ humidity }) {
  // Rotate needle: Assume 0% = -90deg (left), 100% = 90deg (right)
  const rotation = (humidity / 100) * 180 - 90;

  // HumidityGauge.js – highlighted adjustments
  return (
    <div className="gauge-wrapper">
      {" "}
      {/* new container */}
      <div className="gauge">
        <div
          className="needle"
          style={{ transform: `rotate(${rotation}deg)` }}
        />
      </div>
      <div className="labels">
        {" "}
        {/* moved outside .gauge */}
        <span>0%</span>
        <span>100%</span>
      </div>
    </div>
  );
}

export default HumidityGauge;

/*
// HumidityGauge.js
import React from 'react';
import './HumidityGauge.css'; // Create this CSS file

function HumidityGauge({ humidity }) {
  // Rotate needle: Assume 0% = -90deg (left), 100% = 90deg (right)
  const rotation = (humidity / 100) * 180 - 90;

  return (
    <div className="gauge">
      <div className="needle" style={{ transform: `rotate(${rotation}deg)` }}></div>
      <div className="labels">
        <span>0%</span>
        <span>100%</span>
      </div>
    </div>
  );
}

export default HumidityGauge;
*/
