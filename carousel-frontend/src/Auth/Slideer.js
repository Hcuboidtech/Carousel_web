import React from "react";
import Slider from "react-slick";
import slider1 from "../Images/slider1.png";
import Vector from "../Images/Vector.png";




const Slideer = () => {

  return (
    <div className="col-md-4 slider">
       <div className="slider1">
         <div className="vec">
          <img src={Vector}/>
         </div>
         <img src={slider1}/>
         <h2>Powerful Transaction Management</h2>
         <p className="sub-title">We are the Home Buying Experts. We help streamline the complex process of purchasing a property.</p>
        </div>

        <div className="active-bar">
            <div className="linebar act-line"></div>
            <div className="linebar"></div>
            <div className="linebar"></div>
        </div>

    </div>
  )
}

export default Slideer
