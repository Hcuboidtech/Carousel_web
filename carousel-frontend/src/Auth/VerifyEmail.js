import React, { useState, useEffect } from 'react';
import axios from "axios";import logos from '../Images/logos.png'
import { useNavigate, useParams } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css';
import { showToast } from '../Services/ToastComponent';
import { Spinner } from "react-bootstrap";

const Verify = () => {
  const navigate = useNavigate();

    const [showLoading, setShowLoading] = useState(false);
    const [email, setEmail] = useState();


    const { id,slug } = useParams();

    useEffect(() => {
      checkAuthentication();
    }, []);

    const checkAuthentication = async () => {
      let submitFormData = new FormData();
      submitFormData.append("slug", slug ?? "");
      console.log(slug);
      try {
          axios.get(process.env.REACT_APP_API_URL+`/get-user/${slug}`,
      {
          headers: {
          "Content-Type": 'application/json',
          }
      })
      .then((response) => {
          if (response.status === 200) {
            setEmail(response.data.user.email)
          } else {
          showToast('error', 'Something went wrong');
          }
      }).catch((error) => {
          setEmail(error.response.data.user.email)
          // showToast('error',error.response.data.msg);
      });
    } catch (err) {
      console.error(err);
    }
  };

      const resendOtpFormSubmit = async (event) => {
            axios.get(process.env.REACT_APP_API_URL+`/resend-verify-email/${id}`,
            {
                headers: {
                    "Content-Type": 'application/json',
                },
            })
            .then((response) => {
            if (response.status === 200) {
                // setUserSlug(response.data.user.slug)
                showToast('success', response.data.msg);
            } else {
                showToast('error', response.data.msg);
            }
            }).catch((error) => {
            showToast('error',error.response.data.msg);
        });
      }

  return (
    <div className="verify-page">
      <header>
        <div className="logo-box">
          <img src={logos} />
        </div>
      </header>

      <div className="verification">
        <h3>Verify your email address</h3>
        <p className="sub-title">
          We have send a verification link to  <br /> {email}
        </p>
        <p>Click on the link to complete the verification process.
          You might need to Click your spam folder</p>
        <button
          className="prim-btn"
          onClick={() => resendOtpFormSubmit()}
          disabled={showLoading}
        >
          {showLoading ? (
            <Spinner animation="border" />
          ) : (
            "Resend verification link"
          )}
        </button>
      </div>
    </div>
  );
};

export default Verify;
