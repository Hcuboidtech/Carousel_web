import React from "react";
import Slider from "react-slick";
// import slider1 from "../Images/slider1.png";
import slider1 from "../Images/Vector.png";
import Vector1 from "../Images/create.png";
const Slideer = () => {
  return (
    <div className="col-md-4 slider">
      <div className="slider1">
        <div className="vec">
          <img src={slider1} />
        </div>
        <img src={Vector1} className="create-vector" />
        <h2>Seamless process management</h2>
        <p className="sub-title">
          Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem
          ipsum Lorem ipsum Lorem ipsum
        </p>
      </div>

      <div className="active-bar  non-page">
        <div className="linebar"></div>
        <div className="linebar act-line"></div>
        <div className="linebar"></div>
      </div>
    </div>
  );
};

export default Slideer;
