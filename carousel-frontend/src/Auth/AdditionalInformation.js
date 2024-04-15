import React, { useEffect, useState } from "react";
import logos from "../Images/logos.png";
import { useNavigate, useParams } from "react-router-dom";
import Slideer from "./Slideer-additional";
import FormValidator from "../Services/FormValidator";
import { showToast } from "../Services/ToastComponent";
import { Spinner } from "react-bootstrap";
import Auth from "../Services/Auth";
import axios from "axios";

const auth = new Auth();

const AdditionalInformation = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [formData, setFormData] = useState({
    saving: false,
    first_name: "",
    last_name: "",
    street_address: "",
    city: "",
    state: "",
    zip_code: "",
  });

  const validator = new FormValidator([
    {
      field: "first_name",
      method: "isEmpty",
      validWhen: false,
      message: "Please enter first name.",
    },
    {
      field: "last_name",
      method: "isEmpty",
      validWhen: false,
      message: "Please enter last address.",
    },
    {
      field: "street_address",
      method: "isEmpty",
      validWhen: false,
      message: "Please enter street address.",
    },
    {
      field: "city",
      method: "isEmpty",
      validWhen: false,
      message: "Please enter city.",
    },
    {
      field: "state",
      method: "isEmpty",
      validWhen: false,
      message: "Please enter state.",
    },
    {
      field: "zip_code",
      method: "isEmpty",
      validWhen: false,
      message: "Please enter zip code.",
    },
  ]);
  const [submitted, setSubmitted] = useState(false);
  const [validation, setValidation] = useState(validator.valid());
  const [showLoading, setShowLoading] = useState(false);
  const [userData, setUserData] = useState('');
  

  let checkValidation = submitted ? validator.validate(formData) : validation;

  const handleNumericChange = (event) => {
    const { name, value } = event.target;
    // Replace any non-numeric characters with an empty string
    const numericValue = value.replace(/\D/g, '');
    setFormData((prevState) => ({
      ...prevState,
      [name]: numericValue,
    }));
  };

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
      setShowLoading(true);
      let submitFormData = new FormData();
      submitFormData.append("slug", slug ?? "");
      submitFormData.append("first_name", formData.first_name ?? "");
      submitFormData.append("last_name", formData.last_name ?? "");
      submitFormData.append("street_address", formData.street_address ?? "");
      submitFormData.append("city", formData.city ?? "");
      submitFormData.append("state", formData.state ?? "");
      submitFormData.append("zip_code", formData.zip_code ?? "");

      axios
        .post(
          process.env.REACT_APP_API_URL + "/additional-info",
          submitFormData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          console.log('ress',response);
          setShowLoading(false);
          if (response.status === 200) {
            showToast("success", "Additiona Information Saved successfully.");
            navigate(`/verify-identity/${slug}`, { replace: true });
          }
        })
        .catch((error) => {
          setShowLoading(false);
          showToast("error", error.response.data.msg);
        });
    }
  };

  useEffect(() => {
      checkAuthentication();
  }, []);

  /* const [userId, setUserId] = useState(null);

  useEffect(() => {
      const handleAccountEnrollComplete = (event) => {
          const userId = event.detail.userId;
          setUserId(userId);
      };

      document.addEventListener('account-enroll-complete', handleAccountEnrollComplete);
      console.log('usserrriddd ',userId);
      return () => {
          document.removeEventListener('account-enroll-complete', handleAccountEnrollComplete);
      };
  }, []); */

  const checkAuthentication = async () => {
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
            setFormData(response.data.user);
            // handleNavigation(response)
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
    <>
    <div className="container-fluid cre-acc-page hvh-100">
      <div className="row h-100">
        <div className="col-md-8">
          <header>
            <div className="logo-box">
              <img src={logos} />
            </div>
          </header>
          <main className="account text-center">
            <h2>Additional information</h2>
            <h4 className="sub-title">Lorem ipsum Lorem ipsum Lorem ipsum </h4>
            
    {/* {userId && <p>User ID: {userId}</p>} */}
    {/* <array-account-enroll
    appKey="3F03D20E-5311-43D8-8A76-E4B5D77793BD"
    sandbox="true"
    showQuickView="true"
    firstName={formData.first_name}
    lastName={formData.last_name}
    emailAddress={formData.email}
    >
      <input type="email" value={formData.email} readOnly />
    </array-account-enroll> */}
    
            <form>
              <div className="form-group">
                <label className="sub-title" for="exampleInputEmail1">
                  First Name
                </label>
                <input
                  type="text"
                  onChange={handelChange}
                  name="first_name"
                  value={formData.first_name ?? ""}
                  className="form-control"
                  id="exampleInputEmail1"
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
                  <div className="error">
                    {checkValidation.first_name.message}
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="sub-title" for="exampleInputEmail1">
                  Last Name
                </label>
                <input
                  type="text"
                  onChange={handelChange}
                  name="last_name"
                  value={formData.last_name ?? ""}
                  className="form-control"
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
                  <div className="error">
                    {checkValidation.last_name.message}
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="sub-title" for="exampleInputEmail1">
                  Street Address
                </label>
                <input
                  type="text"
                  onChange={handelChange}
                  name="street_address"
                  value={formData.street_address ?? ""}
                  className="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  placeholder="e.g  1234AD-4675-1882"
                />
                <div
                  className={
                    checkValidation.street_address.isInvalid
                      ? "animated fadeIn err-msg"
                      : ""
                  }
                >
                  <div className="error">
                    {checkValidation.street_address.message}
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="sub-title" for="exampleInputEmail1">
                  City
                </label>
                <input
                  type="text"
                  onChange={handelChange}
                  name="city"
                  value={formData.city ?? ""}
                  className="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  placeholder="e.g  1234AD-4675-1882"
                />
                <div
                  className={
                    checkValidation.city.isInvalid
                      ? "animated fadeIn err-msg"
                      : ""
                  }
                >
                  <div className="error">
                    {checkValidation.city.message}
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="sub-title" for="exampleInputEmail1">
                  State
                </label>
                <input
                  type="text"
                  onChange={handelChange}
                  name="state"
                  value={formData.state ?? ""}
                  className="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  placeholder="e.g  1234AD-4675-1882"
                />
                <div
                  className={
                    checkValidation.state.isInvalid
                      ? "animated fadeIn err-msg"
                      : ""
                  }
                >
                  <div className="error">
                    {checkValidation.state.message}
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="sub-title" for="exampleInputEmail1">
                  Zip Code
                </label>
                <input
                  type="text"
                  onChange={handleNumericChange}
                  name="zip_code"
                  value={formData.zip_code ?? ""}
                  className="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  placeholder="e.g  1234AD-4675-1882"
                />
                <div
                  className={
                    checkValidation.zip_code.isInvalid
                      ? "animated fadeIn err-msg"
                      : ""
                  }
                >
                  <div className="error">
                    {checkValidation.zip_code.message}
                  </div>
                </div>
              </div>
              <button
              type="submit"
                className="prim-btn"
                onClick={!showLoading ? handleSubmit : null}
                disabled={showLoading}
              >
                {showLoading ? <Spinner animation="border" /> : "Next"}
              </button>
            </form>
          </main>
        </div>
        <Slideer />
      </div>
    </div>
    </>
  );
};

export default AdditionalInformation;
