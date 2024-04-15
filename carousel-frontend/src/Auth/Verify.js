import React, { useState, useEffect } from 'react';
import axios from "axios";import logos from '../Images/logos.png'
import { Link,useNavigate, useParams } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css';
import { showToast } from '../Services/ToastComponent';
import { Spinner } from "react-bootstrap";
import Auth from "../Services/Auth";
const auth = new Auth();


const Verify = () => {
  const navigate = useNavigate();

    const [showLoading, setShowLoading] = useState(false);
    const [slug, setUserSlug] = useState();
    const [email, setEmail] = useState();


    const { id,token } = useParams();

    useEffect(() => {
      if (auth.isLoggedIn()) {
        navigate('/dashboard')
      }else{
        verifyEmail()   
      }
    }, []); 

      const verifyEmail = async()=>{
        await axios.get(process.env.REACT_APP_API_URL+`/verify-email/${id}/${token}`,
          {
            headers: {
              "Content-Type": 'application/json',
            },
          })
          .then((response) => {
            if (response.status === 200) {
                setUserSlug(response.data.user.slug)
                setEmail(response.data.user.email)
                showToast('success', response.data.msg);
                navigate(`/createaccount/${response.data.user.slug}`, { replace: true });
            } else {
              showToast('error', "Something went wrong.");
            }
          }).catch((error) => {
            showToast('error',error.response.data.msg);
        });
      }

      const resendOtpFormSubmit = async (event) => {
            axios.get(process.env.REACT_APP_API_URL+`/resend-verify-email/${id}`,
            {
                headers: {
                    "Content-Type": 'application/json',
                },
            })
            .then((response) => {
            if (response.status === 200) {
                setUserSlug(response.data.user.slug)
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
          Verify your email with the link we sent to <br /> {email}
        </p>
        {/* <button
          className="prim-btn"
          onClick={() => resendOtpFormSubmit()}
          disabled={showLoading}
        >
          {showLoading ? (
            <Spinner animation="border" />
          ) : (
            "Resend verification link"
          )}
        </button> */}
        <Link to={`/createaccount/${slug}`}>Create Account</Link>
      </div>
    </div>
  );
};

export default Verify;
