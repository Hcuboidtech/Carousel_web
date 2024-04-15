import React, { useState, useEffect } from "react";
import logos from "../Images/logos.png";
import { Link, useNavigate, useParams } from "react-router-dom";
import Slideer from "./Slideer-additional";
import { Spinner, Button } from "react-bootstrap";
import axios from "axios";
import { showToast } from "../Services/ToastComponent";
import Auth from "../Services/Auth";
const auth = new Auth();

const Invite = () => {
  const navigate = useNavigate();

  const { slug } = useParams();
  const [experienceInfo, setExperience] = useState([""]); // Initialize with an empty email field
  const [errors, setErrors] = useState([]);
  const [showLoading, setShowLoading] = useState(false);
  const [inviteData,setInviteData] = useState([]);

  const handleExperienceChange = (index, event) => {
    const data = [...experienceInfo];
    data[index] = event.target.value;
    setExperience(data);
  };

  const addFields = () => {
    setExperience([...experienceInfo, ""]);
  };

  const removeFields = (index) => {
    const data = [...experienceInfo];
    data.splice(index, 1);
    setExperience(data);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Reset errors
    setErrors([]);

    // Validation
    let isValid = true;
    const newErrors = experienceInfo.map((email, index) => {
      if (!email || !email.trim()) {
        isValid = false;
        return `Please enter email.`; //${index + 1}
      }
      return null;
    });
    setErrors(newErrors);

    // Check if any error exists
    if (newErrors.some(error => error !== null)) {
      return;
    }
    // setErrors(newErrors.filter((error) => error !== null));

    if (isValid) {
      setShowLoading(true);
      axios
        .post(process.env.REACT_APP_API_URL + "/invite-team", {
          slug,
          emails: experienceInfo,
        })
        .then((response) => {
          console.log(response);
          setShowLoading(false);
          if (response.status === 200) {
            // Handle success
            showToast("success", "Invite team successfully.");
            localStorage.setItem("role", response.data.user.role);
            handleNavigation(response)
          } else {
            // Handle failure
            showToast("error", "Something went wrong");
          }
        })
        .catch((error) => {
          console.error(error.response.data);
          // if(error.response.data.errors['email']){
          //     showToast('error',error.response.data.errors['email']);
          // }
          showToast("error", error.response.data.msg);
          setShowLoading(false);
          // Handle error
        });
    }
  };

  // useEffect(() => {
  //   // if (auth.isLoggedIn()) {
  //   //   isLogged()
  //   // } else {
  //     checkAuthentication();
  //   // }
  // }, []);

  useEffect(() => {
    // Add an empty email field if the array is empty
    if (experienceInfo.length === 0) {
      setExperience([""]);
    }
  }, []);

  const checkAuthentication = async () => {
    let submitFormData = new FormData();
    submitFormData.append("slug", slug ?? "");
    console.log(slug);
    try {
      axios
        .get(process.env.REACT_APP_API_URL + `/get-user/${slug}`, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log(response);
          if (response.status === 200) {
            showToast("success", response.data.msg);
            handleNavigation(response);
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

  function handleNavigation(response) {
    const { user, inviteTeamData } = response.data;
    console.log(inviteTeamData);
    if(auth.isLoggedIn())
    {
      if (user.role === null) {
        navigate(`/createaccount/${user.slug}`, { replace: true });
      }else if (user.role === 'borrower' ) {
        navigate(`/dashboard-borrower`, { replace: true });
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
        navigate(`/login`, { replace: true });
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
    <div className="container-fluid invite-page hvh-100">
      <div className="row h-100">
        <div className="col-md-8">
          <header>
            <div className="logo-box">
              <img src={logos} alt="logo" />
            </div>
          </header>

          <main className="account text-center">
            <h2>Invite</h2>
            <h4 className="sub-title">
              Invite your organization team members{" "}
            </h4>

            <form onSubmit={handleSubmit}>
              <label className="sub-title invite" for="exampleInputEmail1">
                Email Address
              </label>
              {experienceInfo.map((email, index) => (
                <div className="form-group  position-relative" key={index}>
                  <input
                    className="form-control"
                    type="email"
                    value={email ?? ""}
                    placeholder="e.g  email@email.com"
                    onChange={(e) => handleExperienceChange(index, e)}
                  />
                  {index > 0 && (
                    <Button
                      type="button"
                      className="btn-sm text-center input-w-del"
                      onClick={() => removeFields(index)}
                    >
                      <svg
                        width="11"
                        height="15"
                        viewBox="0 0 11 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3.85938 1.875V0.234375H7.14062V1.875"
                          stroke="#B0B4C5"
                          stroke-width="2"
                          stroke-miterlimit="10"
                        />
                        <path
                          d="M1.28125 2.34375V14.7656H9.71875V2.34375"
                          stroke="#B0B4C5"
                          stroke-width="2"
                          stroke-miterlimit="10"
                        />
                        <path
                          d="M4.09375 4.6875V12.6562"
                          stroke="#B0B4C5"
                          stroke-width="2"
                          stroke-miterlimit="10"
                        />
                        <path
                          d="M6.90625 4.6875V12.6562"
                          stroke="#B0B4C5"
                          stroke-width="2"
                          stroke-miterlimit="10"
                        />
                        <path
                          d="M0.34375 2.10938H10.6562"
                          stroke="#B0B4C5"
                          stroke-width="2"
                          stroke-miterlimit="10"
                        />
                      </svg>
                    </Button>
                  )}
                  {/* <Button type="button" style={{ float: 'right' }} variant="danger" className="btn-sm text-center" onClick={() => removeFields(index)}>Remove</Button> */}
                  {errors[index] && (
                    <div className="error">{errors[index]}</div>
                  )}
                </div>
              ))}
              <div className="d-flex justify-content-center align-items-center">
                <Button
                  variant=""
                  className="btn-sm addmore-btn"
                  onClick={addFields}
                >
                  <svg
                    width="18"
                    height="17"
                    viewBox="0 0 18 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M0.666016 8.52132C0.666016 3.91882 4.39685 0.187988 8.99935 0.187988C13.6018 0.187988 17.3327 3.91882 17.3327 8.52132C17.3327 13.1238 13.6018 16.8547 8.99935 16.8547C4.39685 16.8547 0.666016 13.1238 0.666016 8.52132ZM8.99935 1.85465C7.23124 1.85465 5.53555 2.55703 4.2853 3.80728C3.03506 5.05752 2.33268 6.75321 2.33268 8.52132C2.33268 10.2894 3.03506 11.9851 4.2853 13.2354C5.53555 14.4856 7.23124 15.188 8.99935 15.188C10.7675 15.188 12.4632 14.4856 13.7134 13.2354C14.9636 11.9851 15.666 10.2894 15.666 8.52132C15.666 6.75321 14.9636 5.05752 13.7134 3.80728C12.4632 2.55703 10.7675 1.85465 8.99935 1.85465Z"
                      fill="#109CF1"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M9.8326 4.35482C9.8326 4.1338 9.7448 3.92184 9.58852 3.76556C9.43224 3.60928 9.22028 3.52148 8.99927 3.52148C8.77825 3.52148 8.56629 3.60928 8.41001 3.76556C8.25373 3.92184 8.16593 4.1338 8.16593 4.35482V7.68815H4.8326C4.61159 7.68815 4.39963 7.77595 4.24335 7.93223C4.08707 8.08851 3.99927 8.30047 3.99927 8.52148C3.99927 8.7425 4.08707 8.95446 4.24335 9.11074C4.39963 9.26702 4.61159 9.35482 4.8326 9.35482H8.16593V12.6882C8.16593 12.9092 8.25373 13.1211 8.41001 13.2774C8.56629 13.4337 8.77825 13.5215 8.99927 13.5215C9.22028 13.5215 9.43224 13.4337 9.58852 13.2774C9.7448 13.1211 9.8326 12.9092 9.8326 12.6882V9.35482H13.1659C13.3869 9.35482 13.5989 9.26702 13.7552 9.11074C13.9115 8.95446 13.9993 8.7425 13.9993 8.52148C13.9993 8.30047 13.9115 8.08851 13.7552 7.93223C13.5989 7.77595 13.3869 7.68815 13.1659 7.68815H9.8326V4.35482Z"
                      fill="#109CF1"
                    />
                  </svg>
                  Add More
                </Button>
              </div>
              <div className="btn-list underline">
                <button
                  className="prim-btn"
                  type="submit"
                  disabled={showLoading}
                >
                  {showLoading ? <Spinner animation="border" /> : "Submit"}
                </button>
                <Link to="/login">Skip</Link>
              </div>
            </form>
          </main>
        </div>
        <Slideer />
      </div>
    </div>
  );
};

export default Invite;
