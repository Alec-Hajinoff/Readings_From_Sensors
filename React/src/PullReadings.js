// This file runs the user dashboard displaying sensor readings.

import React, { useEffect, useState } from "react";
import "./PullReadings.css";
import LogoutComponent from "./LogoutComponent";
import { pullReadingsFunction } from "./ApiService";

function CreateAgreement() {
  const [sensorData, setSensorData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const loadSensorData = async () => {
    try {
      setLoading(true);
      const data = await pullReadingsFunction();
      if (data.success && data.data) {
        setSensorData(data.data);
        setErrorMessage("");
      } else {
        setSensorData(null);
        setErrorMessage("Failed to load sensor data");
      }
    } catch (error) {
      setSensorData(null);
      setErrorMessage(error.message || "Failed to load sensor data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSensorData();
  }, []);

  return (
    <div className="container">
      <div className="d-flex justify-content-end mb-3">
        <LogoutComponent />
      </div>
      <h1 className="mb-4">Latest Sensor Reading</h1>
      <div className="mb-3">
        <button
          className="btn btn-primary"
          onClick={loadSensorData}
          disabled={loading}
        >
          Refresh
        </button>
      </div>
      {loading && <p>Loading sensor data...</p>}
      {!loading && errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}
      {!loading && sensorData && (
        <div className="card">
          <div className="card-body">
            <p className="card-text">
              <strong>Temperature:</strong> {sensorData.temperature}
            </p>
            <p className="card-text">
              <strong>Humidity:</strong> {sensorData.humidity}
            </p>
            <p className="card-text">
              <strong>Received At:</strong>{" "}
              {new Date(sensorData.inserted_at).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateAgreement;
