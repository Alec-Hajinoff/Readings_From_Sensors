import { Routes, Route } from "react-router-dom";
import MainRegLog from "./MainRegLog";
import RegisteredPage from "./RegisteredPage";
import PullReadings from "./PullReadings";
import LogoutComponent from "./LogoutComponent";
import React from "react";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainRegLog />} />
      <Route path="RegisteredPage" element={<RegisteredPage />} />
      <Route path="PullReadings" element={<PullReadings />} />
      <Route path="LogoutComponent" element={<LogoutComponent />} />
    </Routes>
  );
}

/*
//import logo from './logo.svg';
import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./Header";
import MainRegLog from "./MainRegLog";
import Footer from "./Footer";
import RegisteredPage from "./RegisteredPage";
import PullReadings from "./PullReadings";
import LogoutComponent from "./LogoutComponent";

function App() {
  return (
    <div>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<MainRegLog />} />
          <Route path="RegisteredPage" element={<RegisteredPage />} />
          <Route path="PullReadings" element={<PullReadings />} />
          <Route path="LogoutComponent" element={<LogoutComponent />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
*/
