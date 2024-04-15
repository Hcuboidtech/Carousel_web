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

const VerifyIdentity = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [formData, setFormData] = useState({
    saving: false,
    slug: "",
    date: "",
    month: "",
    year: "",
    ssn_1: "",
    ssn_2: "",
    ssn_3: "",
    phone_number: "",
    email: ""
  });
  const [borrowerAdditional, setborrowerAdditional] = useState()
  // const [borrowerVerify, setborrowerVerify] = useState()
    

  const validator = new FormValidator([
    {
      field: "date",
      method: "isEmpty",
      validWhen: false,
      message: "Please enter date htmlFor birth.",
    },
    {
      field: "month",
      method: "isEmpty",
      validWhen: false,
      message: "Please enter month htmlFor birth.",
    },
    {
      field: "year",
      method: "isEmpty",
      validWhen: false,
      message: "Please enter year htmlFor birth.",
    },
    {
      field: "date",
      method: (value) => {
        // Validate date format (2 digits)
        return value.length === 2 && /^\d+$/.test(value) && parseInt(value, 10) >= 1 && parseInt(value, 10) <= 31;
      },
      validWhen: true,
      message: "Please enter a valid date (DD).",
    },
    {
      field: "month",
      method: (value) => {
        return value.length === 2 && /^\d+$/.test(value) && parseInt(value, 10) >= 1 && parseInt(value, 10) <= 12;
      },
      validWhen: true,
      message: "Please enter a valid month (MM).",
    },
    {
      field: "year",
      method: (value) => {
        return value.length === 4 && /^\d+$/.test(value);
      },
      validWhen: true,
      message: "Please enter a valid year (YYYY).",
    },
    {
      field: "ssn_1",
      method: "isEmpty",
      validWhen: false,
      message: "Please enter social security no.",
    },
    {
      field: "ssn_2",
      method: "isEmpty",
      validWhen: false,
      message: "Please enter social security no.",
    },
    {
      field: "ssn_3",
      method: "isEmpty",
      validWhen: false,
      message: "Please enter social security no.",
    },
    {
      field: "phone_number",
      method: "isEmpty",
      validWhen: false,
      message: "Please enter phone number.",
    },
    {
      field: "phone_number",
      method: (value) => {
        // Validation function htmlFor US phone number format
        const phoneNumberRegex = /^\d{10}$/; // 10 digits htmlFor US phone number
        return !value || phoneNumberRegex.test(value);
      },
      validWhen: true,
      message: "Please enter a valid US phone number.",
    },
    {
      field: "email",
      method: "isEmpty",
      validWhen: false,
      message: "Please enter email.",
    },
  ]);
  const [submitted, setSubmitted] = useState(false);
  const [validation, setValidation] = useState(validator.valid());
  const [showLoading, setShowLoading] = useState(false);

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
      let dob = formData.year+'-'+formData.month+'-'+formData.date;
      let ssn = formData.ssn_1+'-'+formData.ssn_2+'-'+formData.ssn_3;

      //STORE IN API
      let arrayFormData = new FormData();
      arrayFormData.append('appId',process.env.REACT_APP_ARRAY_APP_KEY)
      arrayFormData.append("firstName", borrowerAdditional.first_name ?? "");
      arrayFormData.append("lastName", borrowerAdditional.last_name ?? "");
      arrayFormData.append("address.street", borrowerAdditional.street_address ?? "");
      arrayFormData.append("address.city", borrowerAdditional.city ?? "");
      arrayFormData.append("address.state", borrowerAdditional.state ?? "");
      arrayFormData.append("address.zip", borrowerAdditional.zip_code ?? "");
      arrayFormData.append("dateOfBirth", dob ?? "");
      arrayFormData.append("socialSecurityNumber", ssn ?? "");
      arrayFormData.append("emailAddress", formData.email ?? "");
      arrayFormData.append("phoneNumber", formData.phone_number ?? "");

      //STORE IN DB
      let submitFormData = new FormData();      
      submitFormData.append("slug", slug ?? "");
      submitFormData.append("dob", dob ?? "");
      submitFormData.append("ssn", ssn ?? "");
      submitFormData.append("phone_number", formData.phone_number ?? "");
      submitFormData.append("email", formData.email ?? "");

      axios
        .post(
          process.env.REACT_APP_ARRAY_URL + "/user/v4",
          arrayFormData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          console.log('AY',response);
          submitFormData.append("userId", response.data.userId ?? "");
          submitFormData.append("userToken", response.data.userToken ?? "");
          submitFormData.append("kbaToken", response.data.kbaToken ?? "");
          axios
          .post(
            process.env.REACT_APP_API_URL + "/verify-identity",
            submitFormData,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
          .then((response) => {
            console.log(response);
            if (response.status === 200) {
              showToast("success", "Verify Identity Saved successfully.");
              navigate(`/verify-questions/${slug}`, { replace: true });
            } else {
              console.error("API Error:", response.status);
              showToast("error", "Something went wrong");
            }
          })
          .catch((error) => {
            showToast("error", error.response.data.msg);
          });
        })
        .catch((error) => {
          console.log(error.message);
          showToast("error", error.messageg);
        });


     /*   */
    }
  };

  useEffect(() => {
    checkAuthentication();
    // autoVerifyUser();
  }, []);

  /* const autoVerifyUser = async () => {
    
    // let arrayFormData = new FormData();
    // arrayFormData.append('userId','65a149eb-cd95-4693-be4a-5747d392e3b6')
    // arrayFormData.append("authDetails.", borrowerAdditional.first_name ?? "");
    console.log(borrowerVerify);
    console.log(borrowerAdditional);
    try {
      axios
        .patch(process.env.REACT_APP_ARRAY_URL + "/authenticate/v2",
        {
          headers: {
            'x-array-server-token': process.env.REACT_APP_ARRAY_SERVER_TOKEN,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: '2268bb3e-cd9f-4fc2-adc3-825ac982493c',//borrowerVerify.userId,//'65a149eb-cd95-4693-be4a-5747d392e3b6',
            provider1: 'efx' // Pass an empty object for authDetails
          })
        })
        .then((response) => {
          console.log('VERIFY SUCCESS ',response);
          if (response.status === 200) {
            showToast("success", response.data.msg);
            // setborrowerAdditional(response.data.borrowerAdditionalData)
            // handleNavigation(response)
          } else {
            console.error("API Error:", response.status);
            showToast("error", "Something went wrong");
          }
        })
        .catch((error) => {
          console.log('not verify',error.message);
          showToast("error", error.message);
          
        });
    } catch (err) {
      console.error(err);
    }
  } */

  const checkAuthentication = async () => {
    try {
      axios
        .get(process.env.REACT_APP_API_URL + `/get-user/${slug}`, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          // console.log('rreessppoonnssee',response);
          if (response.status === 200) {
            showToast("success", response.data.msg);
            setFormData(response.data.user);
            setborrowerAdditional(response.data.borrowerAdditionalData)
            // setborrowerVerify(response.data.borrowerVerifyInfo)
            // autoVerifyUser();
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
    if (auth.isLoggedIn()) {
      if (user.role === null) {
        navigate(`/createaccount/${user.slug}`, { replace: true });
      } else if (user.role === 'borrower') {
        navigate(`/dashboard-borrower`, { replace: true });
      } else if (user.role != null && user.buisness_name === null) {
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
    } else {

      if (user.role === null) {
        navigate(`/createaccount/${user.slug}`, { replace: true });
      } else if (user.role === 'borrower') {
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
    <div className="container-fluid cre-acc-page hvh-100">
      <div className="row h-100">
        <div className="col-md-8">
          <header>
            <div className="logo-box">
              <img src={logos} />
            </div>
          </header>
          <main className="account text-center">
            <h2>Verify your identity</h2>
            <h4 className="sub-title">Add your information so we can confirm your identity. </h4>
            <form>
              <div className="form-group">
                <label className="sub-title" htmlFor="exampleInputEmail1">
                  Date of birth
                </label>
                <div className="row gy-3 small-card-wrap gap">
                  <div className="col-md-4 col-sm-12">
                    <input
                      type="text"
                      onChange={handleNumericChange}
                      name="date"
                      value={formData.date ?? ""}
                      className="form-control"
                      id="exampleInputEmail1"
                      aria-describedby="emailHelp"
                      placeholder="e g John"
                    />
                    <div
                      className={
                        checkValidation.date.isInvalid
                          ? "animated fadeIn err-msg"
                          : ""
                      }
                    >
                      <div className="error">
                        {checkValidation.date.message}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-12">
                    <input
                      type="text"
                      onChange={handelChange}
                      name="month"
                      value={formData.month ?? ""}
                      className="form-control"
                      id="exampleInputEmail1"
                      aria-describedby="emailHelp"
                      placeholder="e g John"
                    />
                    <div
                      className={
                        checkValidation.month.isInvalid
                          ? "animated fadeIn err-msg"
                          : ""
                      }
                    >
                      <div className="error">
                        {checkValidation.month.message}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-12">
                    <input
                      type="text"
                      onChange={handelChange}
                      name="year"
                      value={formData.year ?? ""}
                      className="form-control"
                      id="exampleInputEmail1"
                      aria-describedby="emailHelp"
                      placeholder="e g John"
                    />
                    <div
                      className={
                        checkValidation.year.isInvalid
                          ? "animated fadeIn err-msg"
                          : ""
                      }
                    >
                      <div className="error">
                        {checkValidation.year.message}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="sub-title" htmlFor="exampleInputEmail1">
                  Social security number
                </label>
                <div className="row gy-3 small-card-wrap gap">
                  <div className="col-md-4 col-sm-12">
                    <input
                      type="text"
                      onChange={handelChange}
                      name="ssn_1"
                      value={formData.ssn_1 ?? ""}
                      className="form-control"
                      id="exampleInputEmail1"
                      aria-describedby="emailHelp"
                      placeholder="e g John"
                    />
                    <div
                      className={
                        checkValidation.ssn_1.isInvalid
                          ? "animated fadeIn err-msg"
                          : ""
                      }
                    >
                      <div className="error">
                        {checkValidation.ssn_1.message}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-12">
                    <input
                      type="text"
                      onChange={handelChange}
                      name="ssn_2"
                      value={formData.ssn_2 ?? ""}
                      className="form-control"
                      id="exampleInputEmail1"
                      aria-describedby="emailHelp"
                      placeholder="e g John"
                    />
                    <div
                      className={
                        checkValidation.ssn_2.isInvalid
                          ? "animated fadeIn err-msg"
                          : ""
                      }
                    >
                      <div className="error">
                        {checkValidation.ssn_2.message}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 col-sm-12">
                    <input
                      type="text"
                      onChange={handelChange}
                      name="ssn_3"
                      value={formData.ssn_3 ?? ""}
                      className="form-control"
                      id="exampleInputEmail1"
                      aria-describedby="emailHelp"
                      placeholder="e g John"
                    />
                    <div
                      className={
                        checkValidation.ssn_3.isInvalid
                          ? "animated fadeIn err-msg"
                          : ""
                      }
                    >
                      <div className="error">
                        {checkValidation.ssn_3.message}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="sub-title" htmlFor="exampleInputEmail1">
                  Phone Number
                </label>
                <input
                  type="text"
                  onChange={handleNumericChange}
                  name="phone_number"
                  value={formData.phone_number ?? ""}
                  className="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  placeholder="e g John"
                />
                <div
                  className={
                    checkValidation.phone_number.isInvalid
                      ? "animated fadeIn err-msg"
                      : ""
                  }
                >
                  <div className="error">
                    {checkValidation.phone_number.message}
                  </div>
                </div>
              </div>

              <h4 className="sub-title">I consent to reciving SMS messages from credit vendors htmlFor identity verifications </h4>

              <div className="form-group">
                <label className="sub-title" htmlFor="exampleInputEmail1">
                  Email
                </label>
                <input
                  type="text"
                  readOnly
                  onChange={handelChange}
                  name="email"
                  value={formData.email ?? ""}
                  className="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  placeholder="e.g  1234AD-4675-1882"
                />
                <div
                  className={
                    checkValidation.email.isInvalid
                      ? "animated fadeIn err-msg"
                      : ""
                  }
                >
                  <div className="error">
                    {checkValidation.email.message}
                  </div>
                </div>
              </div>

              <h4 className="sub-title">I understand that by clicking the "Submit" button below, I agree to the Terms and Conditions and acknowledge receipt of the Privacy Policy. I am authorizing The Company to obtain my credit report on a reccuring basis from any consumer reporting agency to confirm my identity and monitor my credit profile htmlFor changes. I further understand that I can withdraw this authorization at any time by contacting The Company. Message and data rates may apply. Collection of your phone number is subject to our Privacy Policy. </h4>

              <button
                className="prim-btn"
                onClick={!showLoading ? handleSubmit : null}
                disabled={showLoading}
              >
                {showLoading ? <Spinner animation="border" /> : "Submit"}
              </button>
            </form>
          </main>
        </div>
        <Slideer />
      </div>
    </div>
  );
};

export default VerifyIdentity;
