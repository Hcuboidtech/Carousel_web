import React, { useEffect, useState } from "react";
import logos from "../Images/logos.png";
import { Link, useNavigate, useParams } from "react-router-dom";
import Slideer from "./Slideer-createaccount";
import PPlending from "../Images/PPlending.png";
import Buyhome from "../Images/Buyhome.png";
import Lawyer from "../Images/Lawyer.png";
import Realestateagent from "../Images/Realestateagent.png";
import VVBorrower from "../Images/VVBorrower.png";
import FormValidator from "../Services/FormValidator";
import { showToast } from "../Services/ToastComponent";
import { Spinner } from "react-bootstrap";
import Auth from "../Services/Auth";
import axios from "axios";

const auth = new Auth();

const CreateAccount = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [formData, setFormData] = useState({
    saving: false,
    slug: "",
    role: "",
  });

  const validator = new FormValidator([
    {
      field: "role",
      method: "isEmpty",
      validWhen: false,
      message: "Please select role.",
    },
  ]);
  const [submitted, setSubmitted] = useState(false);
  const [validation, setValidation] = useState(validator.valid());
  const [showLoading, setShowLoading] = useState(false);

  let checkValidation = submitted ? validator.validate(formData) : validation;

  const handelChange = (event) => {
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
      let submitFormData = new FormData();
      submitFormData.append("slug", slug ?? "");
      submitFormData.append("role", formData.role ?? "");

      axios
        .post(process.env.REACT_APP_API_URL + "/save-role", submitFormData, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log(response);
          if (response.status === 200) {
            showToast("success", response.data.msg);
            localStorage.setItem("role", response.data.user.role);
            handleNavigation(response)
            // if (response.data.user.role !== "borrower") {
            //   navigate(`/additional/${slug}`, { replace: true });
            // } else {
            //   navigate("/login");
            // }
            //   const responseData = response.json();
            //   console.log('API Response:', responseData);
          } else {
            console.error("API Error:", response.status);
            showToast("error", "Something went wrong");
          }
        })
        .catch((error) => {
          showToast("error", error.response.data.msg);
        });
    }
  };
  const Logout = async (event) => {
    auth.logout();
    localStorage.setItem("token", '');
    localStorage.setItem("name", '');
    localStorage.setItem("role", '');
    navigate("/login", { replace: true });
  }

  useEffect(() => {
    /* if (auth.isLoggedIn()) {
      console.log(auth.getSingle('role'));
      if (auth.getSingle("role") == null) {
        navigate(`/createaccount/${slug}`, { replace: true });
      } else if (auth.getSingle("role")  !== 'borrower' && auth.getSingle("buisness_name") === '') {
        navigate(`/additional/${slug}`, { replace: true });
      } else if (auth.getSingle("role") !== 'borrower' && (!auth.getSingle("inviteTeamData") || auth.getSingle("inviteTeamData").length === 0)) {
        navigate(`/invite/${slug}`, { replace: true });
      } else {
        switch (auth.getSingle("role")) {
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
    } else { */
      // checkAuthentication();
    // }
  }, []);

  const checkAuthentication = async () => {
    try {
      axios
        .get(process.env.REACT_APP_API_URL + `/get-user/${slug}`, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          if (response.status === 200) {
            showToast("success", response.data.msg);
            handleNavigation(response)
          } else {
            console.error("API Error:", response.status);
            showToast("error", "Something went wrong");
          }
        })
        .catch((error) => {
          showToast("error", error.response.data.msg);
          if (error.response.data.user.isVerified === false) {
            let id = error.response.data.user.id;
            let token = error.response.data.usertoken;
            navigate(`/verify/${id}/${token}`);
          }
        });
    } catch (err) {
      console.error(err);
    }
  };
// Define a utility function to handle navigation based on user role and data
function handleNavigation(response) {
  const { user, inviteTeamData } = response.data;
  if(auth.isLoggedIn())
  {
    if (user.role === null && user.role !== "borrower") {
      navigate(`/createaccount/${user.slug}`, { replace: true });
    }else if (user.role === 'borrower' ) {
      navigate(`/additional-info/${slug}`, { replace: true })
      // navigate(`/dashboard-borrower`, { replace: true });
    }  else if (user.role != null && user.buisness_name === null) {
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
  }else{

    if (user.role === null) {
      navigate(`/createaccount/${user.slug}`, { replace: true });
    } else if (user.role === 'borrower' ) {
      navigate(`/additional-info/${slug}`, { replace: true })
      // navigate(`/login`, { replace: true });
    } else if (user.buisness_name === null) {
      navigate(`/additional/${user.slug}`, { replace: true });
    } else if ((!inviteTeamData || inviteTeamData.length === 0)) {
      navigate(`/invite/${user.slug}`, { replace: true });
    } else {
        navigate("/login", { replace: true });
    }
  }
}
  return (
    <div className="container-fluid cre-acc-page hvh-100">
      <div className="row h-100">
        <div className="col-md-8">
          <header>
            <div className="logo-box">
              <img src={logos} />
            </div>
            <h4 className="sub-title sm-none alreadylogged-label">
              {
                auth.getSingle("email") ? (
                  <span>{/* {auth.getSingle("name")} <Link to={Logout}>Logout</Link> */}</span>
                ) : (
                  <span>Already have an account? <Link to="/login">Login</Link></span>
                )
              }
            </h4>
          </header>
          <main className="account text-center">
            <h2 className="pb-4 create-title">Create your Carousel Account</h2>
            {/* <h4 className='sub-title'>Lorem ipsum Lorem ipsum Lorem ipsum </h4> */}

            <div className="active-bar non-page mob-res p-30">
              <div className="linebar grey"></div>
              <div className="linebar act-line"></div>
              <div className="linebar grey"></div>
            </div>

            <div className="category">
              <div className="cat-box">
                <div className="cat-box-item">
                  <div className="cat-img">
                    <img src={PPlending} />
                  </div>
                  <div>
                    <h2>Lender</h2>
                    <p className="sub-title">
                      Loan Officers. Mortgage Brokers. Mortgage Processors.
                      Mortgage Underwriters
                    </p>
                  </div>
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    onChange={handelChange}
                    name="role"
                    value="lender"
                    className="form-check-input"
                    id="exampleCheck1"
                  />
                </div>
              </div>

              <div className="cat-box">
                <div className="cat-box-item">
                  <div className="cat-img">
                    <img src={VVBorrower} />
                  </div>
                  <div>
                    <h2>Borrower</h2>
                    <p className="sub-title">
                      If you are buying a home or refinancing a home
                    </p>
                  </div>
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    onChange={handelChange}
                    name="role"
                    value="borrower"
                    className="form-check-input"
                    id="exampleCheck1"
                  />
                </div>
              </div>

              <div className="cat-box">
                <div className="cat-box-item">
                  <div className="cat-img">
                    <img src={Realestateagent} />
                  </div>
                  <div>
                    <h2>Realtor</h2>
                    <p className="sub-title">
                      Realtor, Real Estate Broker, Transaction Coordinators
                    </p>
                  </div>
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    onChange={handelChange}
                    name="role"
                    value="realtor"
                    className="form-check-input"
                    id="exampleCheck1"
                  />
                </div>
              </div>

              <div className="cat-box">
                <div className="cat-box-item">
                  <div className="cat-img">
                    <img src={Lawyer} />
                  </div>
                  <div>
                    <h2>Attorney</h2>
                    <p className="sub-title">
                      Real Estate Attorney and Paralegals
                    </p>
                  </div>
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    onChange={handelChange}
                    name="role"
                    value="attorny"
                    className="form-check-input"
                    id="exampleCheck1"
                  />
                </div>
              </div>

              <div className="cat-box">
                <div className="cat-box-item">
                  <div className="cat-img">
                    <img src={Buyhome} />
                  </div>
                  <div>
                    <h2>Title / Escrow</h2>
                    <p className="sub-title">
                      Title Agent, Closing Agent, Settlement Agent and
                      Assistants
                    </p>
                  </div>
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    onChange={handelChange}
                    name="role"
                    value="escrow"
                    className="form-check-input"
                    id="exampleCheck1"
                  />
                </div>
              </div>
              <div
                className={
                  checkValidation.role.isInvalid ? "animated fadeIn" : ""
                }
              >
                <div className="error">{checkValidation.role.message}</div>
              </div>
              <button
                className="prim-btn w-80"
                onClick={!showLoading ? handleSubmit : null}
                disabled={showLoading}
              >
                {showLoading ? (
                  <Spinner animation="border" />
                ) : (
                  "Create Account"
                )}
              </button>
            </div>
            <h4 className="sub-title mob-account mt-4">
              {
                auth.getSingle("email") ? (
                  <span>{/* {auth.getSingle("name")} <Link to={Logout}>Logout</Link> */}</span>
                ) : (
                  <span>Already have an account? <Link to="/login">Login</Link></span>
                )
              }
              </h4>
          </main>
        </div>
        <Slideer />
      </div>
    </div>
  );
};

export default CreateAccount;
