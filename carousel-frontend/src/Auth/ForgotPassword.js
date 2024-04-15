import React, { useEffect, useState } from "react";
import logos from "../Images/logos.png";
import { Spinner } from "react-bootstrap";
import { showToast } from "../Services/ToastComponent";
import FormValidator from "../Services/FormValidator";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Auth from "../Services/Auth";
const auth = new Auth();

const CreatePassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    saving: false,
    email: "",
  });

  const validator = new FormValidator([
    {
      field: "email",
      method: "isEmpty",
      validWhen: false,
      message: "Please enter email address.",
    },
    {
      field: "email",
      method: "isEmail",
      validWhen: true,
      message: "Please enter a valid email address.",
    },
  ]);

  const [submitted, setSubmitted] = useState(false);
  const [validation, setValidation] = useState(validator.valid());
  const [showLoading, setShowLoading] = useState(false);

  let checkValidation = submitted ? validator.validate(formData) : validation;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validation = validator.validate(formData);
    setValidation(validation);
    setSubmitted(true);
    if (validation.isValid) {
      setShowLoading(true);
      axios
        .post(process.env.REACT_APP_API_URL + "/forgot-password", {
          email: formData.email,
        })
        .then((response) => {
          if (response.status === 200) {
            showToast("success", "Email sent successfully.");
            navigate("/login", { replace: true });
          } else {
            showToast("error", "Something went wrong.");
          }
        })
        .catch((error) => {
          console.log(error);
          showToast("error", error.response.data.msg);
        })
        .finally(() => {
          setShowLoading(false);
        });
      setShowLoading(false);
    }
  };

  useEffect(() => {
    if (auth.isLoggedIn()) {
      navigate("/");
    }
  }, []);

  return (
    <div className="container-fluid sign-acc hvh-100">
      <div className="row h-100">
        <div className="col-md-12">
          <header>
            <div className="logo-box">
              <Link to="/">
                <img src={logos} alt="logo" />
              </Link>
            </div>
          </header>
          <main className="container miksignin center-box">
            <div className="logs forgot">
              <h1>Enter Your Email Address</h1>
              <div className="form-group mb-0">
                <label className="sub-title" htmlFor="exampleInputPassword1">
                  Enter email
                </label>
                <div className="eye-offs">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control"
                    id="exampleInputPassword1"
                    placeholder="Enter Email"
                  />
                </div>
              </div>
              {checkValidation.email.isInvalid && (
                <div className="animated fadeIn err-msg">
                  <div className="error">{checkValidation.email.message}</div>
                </div>
              )}
              <button
                className="prim-btn mt-4"
                onClick={!showLoading ? handleSubmit : null}
                disabled={showLoading}
              >
                {showLoading ? <Spinner animation="border" /> : "Confirm"}
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CreatePassword;
