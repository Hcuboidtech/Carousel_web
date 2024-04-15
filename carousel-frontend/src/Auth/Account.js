import React, { useEffect, useState } from "react";
import axios from "axios";
import logos from "../Images/logos.png";
import Eyeoff from "../Images/Eyeoff.png";
import { Link, useNavigate } from "react-router-dom";
import FormValidator from "../Services/FormValidator";
import { showToast } from "../Services/ToastComponent";
import { Spinner, Form } from "react-bootstrap";
import Eyeon from "../Images/Eyeon.png";
import Auth from "../Services/Auth";

const auth = new Auth();

const Account = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    saving: false,
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    agree: false,
    password_length: false,
    validatedForPassword: false,
    passNotMatch: false,
  });

  const validator = new FormValidator([
    {
      field: "first_name",
      method: "isEmpty",
      validWhen: false,
      message: "Please enter first name.",
    },
    {
      field: "first_name",
      method: (value) => /^[a-zA-Z]*$/.test(value),
      validWhen: true,
      message: "First name should only contain alphabetic characters.",
    },
    {
      field: "last_name",
      method: "isEmpty",
      validWhen: false,
      message: "Please enter last name.",
    },
    {
      field: "last_name",
      method: (value) => /^[a-zA-Z]*$/.test(value),
      validWhen: true,
      message: "Last name should only contain alphabetic characters.",
    },
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
      message: "Please enter valid email address.",
    },
    {
      field: "password",
      method: (value) => value.length >= 7,
      validWhen: true,
      message: "Password must be at least 7 characters long.",
    },
    {
      field: "confirm_password",
      method: (value) => value === formData.password,
      validWhen: true,
      message: "Passwords do not match.",
    },
    // {
    //     field: "agree",
    //     method: (value) => value === true,
    //     validWhen: true,
    //     message: "Please select terms & agree.",
    // }
  ]);
  const [submitted, setSubmitted] = useState(false);
  const [validation, setValidation] = useState(validator.valid());
  const [showLoading, setShowLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  let checkValidation = submitted ? validator.validate(formData) : validation;

  const handelChange = (event) => {
    const { name, value, type, checked } = event.target;
    if (name === "password") {
      if (value.length > 0 && value.length < 6) {
        setFormData((prevState) => ({
          ...prevState,
          password_length: true,
        }));
      } else {
        setFormData((prevState) => ({
          ...prevState,
          password_length: false,
        }));
      }
    }
    // Handling checkbox separately
    if (type === "checkbox") {
      setFormData((prevState) => ({
        ...prevState,
        [name]: checked,
      }));
    }
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const checkPassIsSame = (event) => {
    if (
      event.target.value !== formData.password &&
      event.target.value !== "" &&
      event.target.value !== null
    ) {
      setFormData((prevState) => ({
        ...prevState,
        passNotMatch: true,
        validatedForPassword: false,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        passNotMatch: false,
      }));
    }
  };

  const initialFormData = {
    // Store initial form data
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    agree: false,
    password_length: false,
    validatedForPassword: false,
    passNotMatch: false,
  };
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setValidation(validator.valid());
    setSubmitted(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validation = validator.validate(formData);
    setValidation(validation);
    setSubmitted(true);

    let submitFormData = new FormData();
    submitFormData.append("first_name", formData.first_name ?? "");
    submitFormData.append("last_name", formData.last_name ?? "");
    submitFormData.append("email", formData.email ?? "");
    submitFormData.append("password", formData.password ?? "");
    submitFormData.append("confirm_password", formData.confirm_password ?? "");

   /*  navigate(
      `/additional-information/abcd`
    ) */

    if (validation.isValid && formData.agree) {
      setShowLoading(true);
      axios
        .post(process.env.REACT_APP_API_URL + "/register", submitFormData, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          if (response.status === 201) {
            showToast(
              "success",
              "Registration successful. Email Sent successfully. Please verify your account."
            );
            resetForm();
            navigate(
              `/email-verification/${response.data.user.id}/${response.data.user.slug}`
            );
          } else {
            console.error("API Error:", response.status);
            showToast("error", "Something went wrong.");
          }
        })
        .catch((error) => {
          showToast("error", error.response.data.msg);
        })
        .finally(() => {
          setShowLoading(false);
        });
    }
  };

  useEffect(() => {
    if (auth.isLoggedIn()) {
      // navigate("/");
      let role = auth.getSingle('role');
      let slug = auth.getSingle('slug');
      if (role == null) {
        navigate(`/createaccount/${slug}`, { replace: true });
      }else if (role === 'borrower' ) {
        navigate(`/additional-info/${slug}`, { replace: true })
        // navigate(`/dashboard-borrower`, { replace: true });
      }  else if (role != null && auth.getSingle('buisness_name') === null) {
        navigate(`/additional/${slug}`, { replace: true });
      } else if ((!auth.getSingle('inviteTeamData') || auth.getSingle('inviteTeamData').length === 0)) {
        navigate(`/invite/${slug}`, { replace: true });
      } else {
      switch (auth.getSingle('role')) {
        case "lender":
          navigate("/dashboard-lender", { replace: true });
          break;
        case "borrower":
          navigate("/dashboard-borrower", { replace: true });
          break;
        case "realtor":
          navigate("/dashboard-real", { replace: true });
          break;
        case "attorny":
          navigate("/dashboard-attorny", { replace: true });
          break;
        case "escrow":
          navigate("/dashboard-escrow", { replace: true });
          break;
        default:
          // Handle any other role if necessary
          break;
      }
    }
    }
  }, []);

  return (
    <div className="col-md-8">
      <header>
        <div className="logo-box">
          <Link to="/">
            <img src={logos} />
          </Link>
        </div>
        <h4 className="sub-title desk-account">
        {
          auth.getSingle("email") ? (
            <></>
            // auth.getSingle("name")
          ) : (
            <span>Already have an account? <Link to="/login">Login</Link></span>
          )
        }
        </h4>
      </header>
      <main className="account">
        <h2>Create a Carousel Account</h2>
        <div className="active-bar slider mob-res p-30">
          <div className="linebar act-line"></div>
          <div className="linebar grey"></div>
          <div className="linebar grey"></div>
        </div>
        {/* <h4 className='sub-title'> </h4> */}
        <Form>
          <div className="form-group">
            <label className="sub-title" htmlFor="exampleInputEmail1">
              First Name
            </label>
            <input
              type="text"
              className="form-control"
              name="first_name"
              id="exampleInputEmail1"
              value={formData.first_name ?? ""}
              onChange={handelChange}
              aria-describedby="emailHelp"
              placeholder="e g John"
            />
            <div
              className={
                checkValidation.first_name.isInvalid
                  ? "animated fadeIn err-msg"
                  : ""
              }
            >
              <div className="error">{checkValidation.first_name.message}</div>
            </div>
          </div>
          <div className="form-group">
            <label className="sub-title" htmlFor="exampleInputEmail1">
              Last Name
            </label>
            <input
              type="text"
              className="form-control"
              name="last_name"
              value={formData.last_name ?? ""}
              onChange={handelChange}
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="e g John"
            />
            <div
              className={
                checkValidation.last_name.isInvalid
                  ? "animated fadeIn err-msg"
                  : ""
              }
            >
              <div className="error">{checkValidation.last_name.message}</div>
            </div>
          </div>
          <div className="form-group">
            <label className="sub-title" htmlFor="exampleInputEmail1">
              Your email address
            </label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email ?? ""}
              onChange={handelChange}
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="e.g  john.doe@gmail.com"
            />
            <div
              className={
                checkValidation.email.isInvalid ? "animated fadeIn err-msg" : ""
              }
            >
              <div className="error">{checkValidation.email.message}</div>
            </div>
          </div>
          <div className="form-group">
            <label className="sub-title" htmlFor="exampleInputPassword1">
              Password
            </label>
            <div className="eye-offs">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                name="password"
                value={formData.password ?? ""}
                onChange={handelChange}
                id="exampleInputPassword1"
                placeholder="e.g   PassW07d!!"
              />
              <img
                className="eyeoff"
                src={showPassword ? Eyeon : Eyeoff}
                onClick={toggleShowPassword}
                alt="toggle-password"
              />
            </div>
            <small id="emailHelp" className="form-text text-muted">
              Your password be at least 7 characters long.
            </small>
            <div
              className={
                checkValidation.password.isInvalid
                  ? "animated fadeIn err-msg"
                  : ""
              }
            >
              <div className="error">{checkValidation.password.message}</div>
            </div>
          </div>
          <div className="form-group">
            <label className="sub-title" htmlFor="exampleInputPassword1">
              Confirm password
            </label>
            <div className="eye-offs">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="form-control"
                name="confirm_password"
                value={formData.confirm_password ?? ""}
                onChange={handelChange}
                onKeyUp={checkPassIsSame}
                id="exampleInputPassword1"
                placeholder="e.g   PassW07d!!"
              />
              <img
                className="eyeoff"
                src={showConfirmPassword ? Eyeon : Eyeoff}
                onClick={toggleShowConfirmPassword}
                alt="toggle-confirm-password"
              />
            </div>
            <div
              className={
                checkValidation.confirm_password.isInvalid
                  ? "animated fadeIn err-msg"
                  : ""
              }
            >
              <div className="error">
                {checkValidation.confirm_password.message}
              </div>
            </div>
          </div>
          <div className="form-group terms-form">
            <div class="custom-control custom-checkbox">
              <input
                type="checkbox"
                className="custom-control-input"
                id="customCheckBox1"
              />
              <label
                className="custom-control-label terms-label"
                htmlFor="customCheckBox1"
              >
                {" "}
                I’d like to receive occasionaly updates
              </label>
            </div>
          </div>
          <div className="form-group">
            <div class="custom-control custom-checkbox">
              <input
                type="checkbox"
                name="agree"
                checked={formData.agree}
                onChange={(e) =>
                  setFormData({ ...formData, agree: e.target.checked })
                }
                className="custom-control-input"
                id="agree"
              />
              <label
                className="custom-control-label terms-label"
                htmlFor="agree"
              >
                I’ve read and agree with Carousel Technology’s{" "}
                <a href="#">
                  {" "}
                  <span className="blue-text-terms">Terms</span>
                </a>{" "}
                &{" "}
                <a href="#">
                  {" "}
                  <span className="blue-text-terms">Privacy Policy</span>
                </a>
              </label>
            </div>
          </div>
          {submitted && !formData.agree && (
            <div className="animated fadeIn err-msg">
              <div className="error">Please select terms & agree.</div>
            </div>
          )}

          <button
            type="submit"
            className="prim-btn"
            onClick={!showLoading ? handleSubmit : null}
            disabled={showLoading}
          >
            {showLoading ? <Spinner animation="border" /> : "Sign up free"}
          </button>
        </Form>
        <h4 className="sub-title mob-account terms-label">
        {
          auth.getSingle("email") ? (
            <></>
            // auth.getSingle("name")
          ) : (
            <span>Already have an account? <Link to="/login">Login</Link></span>
          )
        }        </h4>
      </main>
    </div>
  );
};

export default Account;
