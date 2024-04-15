import React from "react";
import logos from "../Images/logos.png";
import Eyeoff from "../Images/Eyeoff.png";
import { Link } from "react-router-dom";

const SignAccout = () => {
  return (
    <div className="container-fluid invite-page hvh-100">
      <div className="row h-100">
        <div className="col-md-12">
          <header>
            <div className="logo-box">
              <img src={logos} />
            </div>
          </header>
          <main className="container center-box">
            <div className="logs ">
              <h1>Sign in to your account</h1>
              <div class="form-group">
                <label className="sub-title" for="exampleInputEmail1">
                  Your email address
                </label>
                <input
                  type="email"
                  class="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  placeholder="e.g  john.doe@gmail.com"
                />
              </div>
              <div class="form-group">
                <label className="sub-title" for="exampleInputPassword1">
                  Your password
                </label>
                <div className="eye-offs">
                  <input
                    type="password"
                    class="form-control"
                    id="exampleInputPassword1"
                    placeholder="e.g   PassW07d!!"
                  />
                  <img className="eyeoff" src={Eyeoff} />
                </div>
              </div>
              <button className="prim-btn">Sign up free</button>
              <div className="forgot-btn">
                <Link>I have forgotten my password</Link>
                <p>
                  Don’t have an account?{" "}
                  <Link to="/createpassword" className="blue-text">
                    {" "}
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default SignAccout;
