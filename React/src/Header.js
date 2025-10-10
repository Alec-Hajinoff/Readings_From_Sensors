import React from "react";
import blue from "./Readings_From_Sensors_Logo.png";
import "./Header.css";

function Header() {
  return (
    <div className="container text-center">
      <div className="row">
        <img id="logo" src={blue} alt="A company logo" title="A company logo" />
      </div>
      <div className="row-auto">
        <br />
      </div>
    </div>
  );
}

export default Header;
