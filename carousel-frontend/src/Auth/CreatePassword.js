import React, { useEffect, useState } from 'react'
import logos from '../Images/logos.png'
import Eyeoff from '../Images/Eyeoff.png'
import Eyeon from '../Images/Eyeon.png';
import { Spinner } from "react-bootstrap";
import { showToast } from '../Services/ToastComponent';
import FormValidator from "../Services/FormValidator";
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import Auth from "../Services/Auth";
const auth = new Auth();

const CreatePassword = () => {
    const navigate = useNavigate();
    const { token } = useParams();
    const [formData, setFormData] = useState({
        saving: false,
        password: '',
        confirmPassword:''
    });

    const validator = new FormValidator([
        {
            field: "password",
            method: (value) => value.length >= 7,
            validWhen: true,
            message: "Password must be at least 7 characters long.",
        },
        {
            field: "confirmPassword",
            method: (value) => value === formData.password,
            validWhen: true,
            message: "Passwords do not match.",
        },
    ]);

    const [submitted, setSubmitted] = useState(false);
    const [validation, setValidation] = useState(validator.valid());
    const [showLoading, setShowLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // State to manage showing password
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State to manage showing confirm password

    let checkValidation = submitted ? validator.validate(formData) : validation;

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const toggleShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const validation = validator.validate(formData);
        setValidation(validation);
        setSubmitted(true);
        if (validation.isValid) {
            setShowLoading(true);
            let submitFormData = new FormData();
            submitFormData.append("token", token ?? "");
            submitFormData.append("password", formData.password ?? "");
            submitFormData.append("confirmPassword", formData.confirmPassword ?? "");
            console.log(submitFormData);
            axios.post(process.env.REACT_APP_API_URL + `/reset-password`,submitFormData, {
                headers: {
                  "Content-Type": 'application/json',
                },
              })
                .then((response) => {
                    if (response.status === 200) {
                        showToast('success', 'Password reset successfully.');
                        navigate("/login", { replace: true });
                    } else {
                        showToast('error', "Something went wrong.");
                    }
                }).catch((error) => {
                    console.log(error);
                    // showToast('error', error.response.data.msg);
                }).finally(() => {
                    setShowLoading(false);
                });
            setShowLoading(false);

        }
    };
    useEffect(() => {
        if (auth.isLoggedIn()) {
          navigate('/')
        }
    }, []);

  return (
    <div className='container-fluid invite-page sign-acc hvh-100'>
    <div className='row h-100'>
        <div className='col-md-12'>
            <header>
                <div className='logo-box'>
                    <img src={logos} />
                </div>
            </header>
            <main className='container center-box'>

                <div className='logs createpass'>
                    <h1>Choose a new password</h1>
                    <div className="form-group">
                        <label className='sub-title' for="exampleInputPassword1">Enter new password</label>
                        <div className='eye-offs'>
                            <input  type={showPassword ? "text" : "password"} name='password' className="form-control" onChange={handleChange} id="exampleInputPassword1" placeholder="e.g   PassW07d!!" />
                            <img className='eyeoff' src={showPassword ? Eyeon : Eyeoff} onClick={toggleShowPassword} alt="toggle-password" />
                        </div>
                        {checkValidation.password.isInvalid &&
                            <div className="animated fadeIn err-msg">
                                <div className="error">{checkValidation.password.message}</div>
                            </div>
                        }
                    </div>

                        <div className="form-group">
                        <label className='sub-title' for="exampleInputPassword1">Confirm password</label>
                        <div className='eye-offs'>
                            <input  type={showConfirmPassword ? "text" : "password"} name='confirmPassword' onChange={handleChange} className="form-control" id="exampleInputPassword1" placeholder="e.g   PassW07d!!" />
                            <img className='eyeoff' src={showConfirmPassword ? Eyeon : Eyeoff} onClick={toggleShowConfirmPassword} alt="toggle-confirm-password" />
                        </div>

                        {checkValidation.confirmPassword.isInvalid &&
                            <div className="animated fadeIn err-msg">
                                <div className="error">{checkValidation.confirmPassword.message}</div>
                            </div>
                        }
                    </div>

                    <button className='prim-btn' onClick={!showLoading ? handleSubmit : null} disabled={showLoading}>
                                {showLoading ? <Spinner animation="border" /> : "Confirm Password"}
                    </button>
                </div>

            </main>
        </div>
    </div>
</div>
  )
}

export default CreatePassword
