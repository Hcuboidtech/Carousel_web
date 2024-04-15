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

const Additional = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [formData, setFormData] = useState({
    saving: false,
    slug: "",
    buisness_name: "",
    buisness_address: "",
    buisness_license: "",
  });

  const validator = new FormValidator([
    {
      field: "buisness_name",
      method: "isEmpty",
      validWhen: false,
      message: "Please enter buisness name.",
    },
    {
      field: "buisness_address",
      method: "isEmpty",
      validWhen: false,
      message: "Please enter business address.",
    },
    {
      field: "buisness_license",
      method: "isEmpty",
      validWhen: false,
      message: "Please enter business license.",
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
      submitFormData.append("buisness_name", formData.buisness_name ?? "");
      submitFormData.append(
        "buisness_address",
        formData.buisness_address ?? ""
      );
      submitFormData.append(
        "buisness_license",
        formData.buisness_license ?? ""
      );

      axios
        .post(
          process.env.REACT_APP_API_URL + "/additional-information",
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
            showToast("success", "Additiona Information Saved successfully.");
            navigate(`/invite/${slug}`, { replace: true });
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

  useEffect(() => {
      checkAuthentication();
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
            {/* <h4 className="sub-title">Lorem ipsum Lorem ipsum Lorem ipsum </h4> */}
            <form>
              <div className="form-group">
                <label className="sub-title" for="exampleInputEmail1">
                  Business Name
                </label>
                <input
                  type="text"
                  onChange={handelChange}
                  name="buisness_name"
                  value={formData.buisness_name ?? ""}
                  className="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  placeholder="e g John"
                />
                <div
                  className={
                    checkValidation.buisness_name.isInvalid
                      ? "animated fadeIn err-msg"
                      : ""
                  }
                >
                  <div className="error">
                    {checkValidation.buisness_name.message}
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="sub-title" for="exampleInputEmail1">
                  Business Address
                </label>
                <input
                  type="text"
                  onChange={handelChange}
                  name="buisness_address"
                  value={formData.buisness_address ?? ""}
                  className="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  placeholder="e.g 12 John Doe Drive, Chino Hills, California"
                />
                <div
                  className={
                    checkValidation.buisness_address.isInvalid
                      ? "animated fadeIn err-msg"
                      : ""
                  }
                >
                  <div className="error">
                    {checkValidation.buisness_address.message}
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="sub-title" for="exampleInputEmail1">
                  Business License
                </label>
                <input
                  type="text"
                  onChange={handelChange}
                  name="buisness_license"
                  value={formData.buisness_license ?? ""}
                  className="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  placeholder="e.g  1234AD-4675-1882"
                />
                <div
                  className={
                    checkValidation.buisness_license.isInvalid
                      ? "animated fadeIn err-msg"
                      : ""
                  }
                >
                  <div className="error">
                    {checkValidation.buisness_license.message}
                  </div>
                </div>
              </div>
              <button
                className="prim-btn"
                onClick={!showLoading ? handleSubmit : null}
                disabled={showLoading}
              >
                {showLoading ? <Spinner animation="border" /> : "Complete"}
              </button>
            </form>
          </main>
        </div>
        <Slideer />
      </div>
    </div>
  );
};

export default Additional;
