import React from "react";
import Slider from "react-slick";
import slider1 from "../Images/Vector.png";
import Vector1 from "../Images/additional.png";

const Slideer = () => {
  return (
    <div className="col-md-4 slider">
      <div className="slider1">
        <div className="vec">
          <img src={slider1} />
        </div>
        <img src={Vector1} />
        <h2 className="mt-4">Total Deal Flow Management</h2>
        <p className="sub-title">
          With a variety of tactics, tools, and techniques, We employ a complete
          strategy to manage deals from start to finish.
        </p>
      </div>

      <div className="active-bar  non-page">
        <div className="linebar"></div>
        <div className="linebar"></div>
        <div className="linebar act-line"></div>
      </div>
    </div>
  );
};

export default Slideer;
