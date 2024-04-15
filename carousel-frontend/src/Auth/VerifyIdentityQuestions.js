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

const VerifyIdentityQuestions = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [formData, setFormData] = useState({
    saving: false,
    slug: "",
  });

  const [borrowerVerify, setborrowerVerifyData] = useState()

  const validator = new FormValidator([
    {
      field: "date",
      method: "isEmpty",
      validWhen: false,
      message: "Please enter date for birth.",
    }
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
    // if (validation.isValid) {
    //   let submitFormData = new FormData();
    //   submitFormData.append("slug", slug ?? "");
    //   submitFormData.append("buisness_name", formData.buisness_name ?? "");
    //   submitFormData.append(
    //     "buisness_address",
    //     formData.buisness_address ?? ""
    //   );
    //   submitFormData.append(
    //     "buisness_license",
    //     formData.buisness_license ?? ""
    //   );

    //   axios
    //     .post(
    //       process.env.REACT_APP_API_URL + "/additional-information",
    //       submitFormData,
    //       {
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //       }
    //     )
    //     .then((response) => {
    //       console.log(response);
    //       if (response.status === 200) {
    //         showToast("success", "Additiona Information Saved successfully.");
    //         navigate(`/invite/${slug}`, { replace: true });
    //       } else {
    //         console.error("API Error:", response.status);
    //         showToast("error", "Something went wrong");
    //       }
    //     })
    //     .catch((error) => {
    //       showToast("error", error.response.data.msg);
    //     });
    // }
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
            setborrowerVerifyData(response.data.borrowerVerifyInfo)
            // handleNavigation(response)
          } else {
            console.error("API Error:", response.status);
            showToast("error", "Something went wrong");
          }
        })
        .catch((error) => {
          console.log(error);
          showToast("error", error.response);
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

  const verifyProcess = async () => {
    
    let arrayFormData = new FormData();
    arrayFormData.append('userId','65a149eb-cd95-4693-be4a-5747d392e3b6')
    arrayFormData.append("appKey", process.env.REACT_APP_ARRAY_APP_KEY);
    arrayFormData.append("provider1", 'tui');
    arrayFormData.append("provider2.", 'exp');
    arrayFormData.append("provider3", 'efx');
    try {
      axios
        .get(process.env.REACT_APP_ARRAY_URL + "/authenticate/v2",
        arrayFormData, {
          headers: {
            'x-array-server-token': process.env.REACT_APP_ARRAY_SERVER_TOKEN,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log('VERRRUUFY ',response);
          if (response.status === 200) {
            showToast("success", response.data.msg);
            // handleNavigation(response)
          } else {
            console.error("API Error:", response.status);
            showToast("error", "Something went wrong");
          }
        })
        .catch((error) => {
          showToast("error", error.message);
          
        });
    } catch (err) {
      console.error(err);
    }
  }

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
          <array-authentication-kba
            appKey={process.env.REACT_APP_ARRAY_APP_KEY}
            sandbox="true"
            userId={borrowerVerify?.userId}
            showResultPages="true"
          ></array-authentication-kba>

          {/* <main className="account">
            <h2 className="text-center">Verify your identity</h2>
            <h4 className="sub-title text-center">Please Select the correct answers to these questions so we can verify your identity </h4>
            <form>
              <ol>
                <li>
                  What is the monthly payment of your most recent mortgage?
                  <ul>
                    <li>$ 1501 - $ 2000</li>
                    <li>$ 2001 - $ 2500</li>
                    <li>$ 3001 - $ 3500</li>
                    <li>$ 3501 - $ 4000</li>
                    <li>None of the Above</li>
                  </ul>
                </li>
                <br></br>
                <li>
                  What state was your social security number issued (this could be the state in which you were born or had your first job)?
                  <ul>
                    <li>Delaware</li>
                    <li>Hawaii</li>
                    <li>Kansas</li>
                    <li>New Hampshire</li>
                    <li>None of the Above</li>
                  </ul>
                </li>
                <br></br>
                <li>
                  Which of the following is a current or previous employer?
                  <ul>
                    <li>Amgen</li>
                    <li>Iec</li>
                    <li>Jones Lang Lasalle</li>
                  </ul>
                </li>
              </ol>
              <br></br>
              <button
                className="prim-btn"
                onClick={!showLoading ? handleSubmit : null}
                disabled={showLoading}
              >
                {showLoading ? <Spinner animation="border" /> : "Submit"}
              </button>
            </form>
          </main> */}
        </div>
        <Slideer />
      </div>
    </div>
  );
};

export default VerifyIdentityQuestions;
