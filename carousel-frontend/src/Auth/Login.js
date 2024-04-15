import React, { useEffect, useState } from "react";
import logos from "../Images/logos.png";
import Eyeoff from "../Images/Eyeoff.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import FormValidator from "../Services/FormValidator";
import { showToast } from "../Services/ToastComponent";
import { Spinner } from "react-bootstrap";
import Auth from "../Services/Auth";
import Eyeon from "../Images/Eyeon.png";

const auth = new Auth();

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    saving: false,
    email: "",
    password: "",
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
      message: "Please enter valid email address.",
    },
    {
      field: "password",
      method: "isEmpty",
      validWhen: false,
      message: "Please enter password.",
    },
  ]);
  const [submitted, setSubmitted] = useState(false);
  const [validation, setValidation] = useState(validator.valid());
  const [showLoading, setShowLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  let checkValidation = submitted ? validator.validate(formData) : validation;

  const handelChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validation = validator.validate(formData);
    setValidation(validation);
    setSubmitted(true);
    if (validation.isValid) {
      //   setShowLoading(true);
      axios
        .post(process.env.REACT_APP_API_URL + "/login", formData, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          if (response.status === 200) {
            showToast("success", "Login successfully.");
            localStorage.setItem("token", response.data.accessToken);
            localStorage.setItem("name", response.data.user.name);
            localStorage.setItem("role", response.data.user.role);
            auth.saveData(response.data);
            console.log("response: ", response.data);
            handleNavigation(response)
            /* if(response.data.user.role == null){
                navigate(`/createaccount/${response.data.user.slug}`, { replace: true });
            }else if(response.data.user.role !== 'borrower' && response.data.user.buisness_name === ''){
                navigate(`/additional/${response.data.user.slug}`, { replace: true });
            }else if(response.data.user.role !== 'borrower' && response.data.inviteTeamData && response.data.inviteTeamData.length === 0){
                navigate(`/invite/${response.data.user.slug}`, { replace: true });
            }
            else if (response.data.user.role === "lender") {
              navigate("/dashboard-lender", { replace: true });
            } else if (response.data.user.role === "borrower") {
              navigate("/dashboard-borrower", { replace: true });
            } else if (response.data.user.role === "realtor") {
              navigate("/dashboard-real", { replace: true });
            } else if (response.data.user.role === "attorny") {
              navigate("/dashboard-attorny", { replace: true });
            } else if (response.data.user.role === "escrow") {
              navigate("/dashboard-escrow", { replace: true });
            } */
            // }
          } else {
            console.error("API Error:", response);
            showToast("error", "Something went wrong.");
          }
        })
        .catch((error) => {
          console.log(error);
          if(error.response){
            showToast("error", error.response.data.msg);
          }else{
            showToast("error", error.message);
          }
        });
      setShowLoading(false);
    }
  };
// Define a utility function to handle navigation based on user role and data
function handleNavigation(response) {
  const { user, inviteTeamData, borrowerAdditionalInfo,borrowerVerifyInfo } = response.data;
  console.log(borrowerAdditionalInfo);
  console.log(borrowerVerifyInfo);
  if (user.role == null) {
    navigate(`/createaccount/${user.slug}`, { replace: true });
  }else if(user.role === 'borrower'){
    if(borrowerAdditionalInfo === ''){
      navigate(`/additional-info/${user.slug}`, { replace: true });
    }else if(borrowerVerifyInfo === ''){
      navigate(`/verify-identity/${user.slug}`, { replace: true });
    }else{
      navigate("/dashboard-borrower", { replace: true });
    }
  } else if (user.buisness_name === null) {
    navigate(`/additional/${user.slug}`, { replace: true });
  } else if ((!inviteTeamData || inviteTeamData.length === 0)) {
    navigate(`/invite/${user.slug}`, { replace: true });
  } else {
    switch (user.role) {
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

useEffect(() => {
  if (auth.isLoggedIn()) {
    // navigate("/");
    let role = auth.getSingle('role');
    let slug = auth.getSingle('slug');
    if (role == null) {
      navigate(`/createaccount/${slug}`, { replace: true });
    }else if (role === 'borrower' ) {
      navigate(`/dashboard-borrower`, { replace: true });
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

// const checkAuthentication = async () => {
//   let slug = auth.getSingle('slug');
// };

  return (
    <div className="container-fluid invite-page hvh-100">
      <div className="row h-100">
        <div className="col-md-12">
          <header>
            <div className="logo-box">
              <img src={logos} />
            </div>
          </header>
          <main className=" miksignin center-box">
            <div className="logs">
              <h1>Sign in to your account</h1>
              <div className="form-group">
                <label className="sub-title" htmlFor="exampleInputEmail1">
                  Your email address
                </label>
                <input
                  type="email"
                  onChange={handelChange}
                  name="email"
                  className="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  placeholder="e.g john.doe@gmail.com"
                />
                <div
                  className={
                    checkValidation.email.isInvalid
                      ? "animated fadeIn err-msg"
                      : ""
                  }
                >
                  <div className="error">{checkValidation.email.message}</div>
                </div>
              </div>
              <div className="form-group">
                <label className="sub-title" htmlFor="exampleInputPassword1">
                  Your password
                </label>
                <div className="eye-offs">
                  <input
                    type={showPassword ? "text" : "password"}
                    onChange={handelChange}
                    name="password"
                    className="form-control"
                    id="exampleInputPassword1"
                    placeholder="e.g PassW07d!!"
                  />
                  <img
                    className="eyeoff"
                    src={showPassword ? Eyeon : Eyeoff}
                    onClick={toggleShowPassword}
                    alt="toggle-password"
                  />
                </div>
                <div
                  className={
                    checkValidation.password.isInvalid
                      ? "animated fadeIn err-msg"
                      : ""
                  }
                >
                  <div className="error">
                    {checkValidation.password.message}
                  </div>
                </div>
              </div>
              <button
                className="prim-btn"
                onClick={!showLoading ? handleSubmit : null}
                disabled={showLoading}
              >
                {showLoading ? <Spinner animation="border" /> : "Sign in"}
              </button>
              <div className="forgot-btn">
                <Link to="/forgot-password">I have forgotten my password</Link>
                <p>
                  Don’t have an account?{" "}
                  <Link to="/" className="blue-text">
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

export default Login;
