import React, { useEffect, useState } from "react";
import axios from "axios";
import logos from "../Images/logos.png";
import Eyeoff from "../Images/Eyeoff.png";
import { Link, useNavigate } from "react-router-dom";
import FormValidator from "../Services/FormValidator";
import Notifier from "../Services/Notifier";
import { showToast } from "../Services/ToastComponent";
import { GetApiService, PostApiService } from "../Services/ApiService";
import { Spinner, Form, Nav } from "react-bootstrap";
import Auth from "../Services/Auth";
import profile from "../../src/Images/prof.png";
import taskchart from "../../src/Images/tasks_chart.png";
import deal from "../../src/Images/deals_graphic.png";
import dashtable from "../../src/Images/dashboard1.png";
const auth = new Auth();
const noti = new Notifier();

const Dashboard = () => {
  
  const navigate = useNavigate();
  const [username, setUsername] = useState();
  const [role, setUserRole] = useState();

  useEffect(() => {
    if (!auth.isLoggedIn()) {
      navigate('/login')
    }else{
      if(auth.getSingle('role') === 'attorny'){
        navigate('/dashboard-attorny')
      }
    }

  setUserRole(localStorage.role);
  setUsername(localStorage.name);
  }, []);

  const Logout = async (event) => {
    // event.preventDefault()
    auth.logout();
    localStorage.setItem("token", '');
    localStorage.setItem("name", '');
    localStorage.setItem("role", '');
    navigate("/login", { replace: true });
  }
  return (
    <div className="main-container d-flex">
      <div className="sidebar" id="side_nav">
        <div className="header-box"></div>

        <div className="d-flex  flex-column sidebar-cont">
          <div className="profile-wrap">
            <img src={profile} />
            <div className="profile-sec">
              <label className="bold">{username}</label>
              <label className="light">{role}</label>
            </div>
          </div>
          <div className="ul-wrap">
            <ul className="list-unstyled gap-4">
              <li className="active">
                <a href="#" className="">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1.5 8.13333C1.33431 8.13333 1.2 7.99902 1.2 7.83333V1.5C1.2 1.33431 1.33431 1.2 1.5 1.2H6.16667C6.33235 1.2 6.46667 1.33431 6.46667 1.5V7.83333C6.46667 7.99902 6.33235 8.13333 6.16667 8.13333H1.5ZM1.5 14.8C1.33431 14.8 1.2 14.6657 1.2 14.5V11.5C1.2 11.3343 1.33431 11.2 1.5 11.2H6.16667C6.33235 11.2 6.46667 11.3343 6.46667 11.5V14.5C6.46667 14.6657 6.33235 14.8 6.16667 14.8H1.5ZM9.83333 14.8C9.66765 14.8 9.53333 14.6657 9.53333 14.5V8.16667C9.53333 8.00098 9.66765 7.86667 9.83333 7.86667H14.5C14.6657 7.86667 14.8 8.00098 14.8 8.16667V14.5C14.8 14.6657 14.6657 14.8 14.5 14.8H9.83333ZM9.53333 1.5C9.53333 1.33431 9.66765 1.2 9.83333 1.2H14.5C14.6657 1.2 14.8 1.33431 14.8 1.5V4.5C14.8 4.66569 14.6657 4.8 14.5 4.8H9.83333C9.66765 4.8 9.53333 4.66569 9.53333 4.5V1.5Z"
                      stroke="#109CF1"
                      stroke-width="1.4"
                    />
                  </svg>
                  <label>Dashboard</label>
                </a>
              </li>
              <li className="">
                <a href="#" className="">
                  <svg
                    width="17"
                    height="16"
                    viewBox="0 0 17 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1.50033 1.2H15.667C15.7387 1.2 15.8003 1.2616 15.8003 1.33333V6.33333C15.8003 6.40507 15.7387 6.46667 15.667 6.46667H1.50033C1.42859 6.46667 1.36699 6.40507 1.36699 6.33333V1.33333C1.36699 1.2616 1.42859 1.2 1.50033 1.2ZM1.50033 9.53333H15.667C15.7387 9.53333 15.8003 9.59493 15.8003 9.66667V14.6667C15.8003 14.7384 15.7387 14.8 15.667 14.8H1.50033C1.42859 14.8 1.36699 14.7384 1.36699 14.6667V9.66667C1.36699 9.59493 1.42859 9.53333 1.50033 9.53333Z"
                      stroke="#C2CFE0"
                      stroke-width="1.4"
                    />
                  </svg>

                  <label>Tasks</label>
                </a>
              </li>
              <li className="">
                <a href="#" className="">
                  <svg
                    width="18"
                    height="14"
                    viewBox="0 0 18 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1.37533 2.00123V2.00065C1.37533 1.46601 1.80815 1.03398 2.33366 1.03398H15.667C16.1971 1.03398 16.6337 1.47058 16.6337 2.00065V12.0007C16.6337 12.5307 16.1971 12.9673 15.667 12.9673H2.33366C1.80368 12.9673 1.36713 12.5309 1.36699 12.0009C1.36699 12.0008 1.36699 12.0007 1.36699 12.0007L1.37533 2.00123Z"
                      stroke="#C2CFE0"
                      stroke-width="1.4"
                    />
                  </svg>

                  <label>Documents</label>
                </a>
              </li>
              <li className="">
                <a href="#" className="">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.81154 4.11155C4.81154 2.34953 6.23842 0.922656 8.00043 0.922656C9.76244 0.922656 11.1893 2.34953 11.1893 4.11155C11.1893 5.87356 9.76244 7.30044 8.00043 7.30044C6.23842 7.30044 4.81154 5.87356 4.81154 4.11155ZM0.922656 12.8615C0.922656 12.4721 1.11218 12.0792 1.54765 11.6773C1.98788 11.271 2.63116 10.9045 3.39842 10.5971C4.93407 9.98193 6.79002 9.67266 8.00043 9.67266C9.21084 9.67266 11.0668 9.98193 12.6024 10.5971C13.3697 10.9045 14.013 11.271 14.4532 11.6773C14.8887 12.0792 15.0782 12.4721 15.0782 12.8615V15.0782H0.922656V12.8615Z"
                      stroke="#C2CFE0"
                      stroke-width="1.4"
                    />
                  </svg>

                  <label>Partners</label>
                </a>
              </li>
              <li className="">
                <a href="#" className="">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_182_12337)">
                      <path
                        d="M5.00033 14.2993H4.71038L4.50535 14.5044L2.36699 16.6427V3.33268C2.36699 2.80262 2.80359 2.36602 3.33366 2.36602H16.667C17.1971 2.36602 17.6337 2.80262 17.6337 3.33268V13.3327C17.6337 13.8628 17.1971 14.2993 16.667 14.2993H5.00033Z"
                        stroke="#C2CFE0"
                        stroke-width="1.4"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_182_12337">
                        <rect width="20" height="20" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>

                  <label>Chat</label>
                </a>
              </li>
              <li className="">
                <a href="#" className="">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_182_12329)">
                      <path
                        d="M2.50033 4.03398H17.5003C17.5721 4.03398 17.6337 4.09558 17.6337 4.16732V15.834C17.6337 15.9057 17.5721 15.9673 17.5003 15.9673H2.50033C2.42859 15.9673 2.36699 15.9057 2.36699 15.834V4.16732C2.36699 4.09558 2.42859 4.03398 2.50033 4.03398Z"
                        stroke="#C2CFE0"
                        stroke-width="1.4"
                      />
                      <rect
                        x="6.5"
                        y="3.33398"
                        width="1.16667"
                        height="13.3333"
                        fill="#C2CFE0"
                      />
                      <rect
                        x="12.333"
                        y="3.33398"
                        width="1.16667"
                        height="13.3333"
                        fill="#C2CFE0"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_182_12329">
                        <rect width="20" height="20" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>

                  <label>Deals</label>
                </a>
              </li>
              <li className="">
                <a href="#" className="">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_182_12329)">
                      <path
                        d="M2.50033 4.03398H17.5003C17.5721 4.03398 17.6337 4.09558 17.6337 4.16732V15.834C17.6337 15.9057 17.5721 15.9673 17.5003 15.9673H2.50033C2.42859 15.9673 2.36699 15.9057 2.36699 15.834V4.16732C2.36699 4.09558 2.42859 4.03398 2.50033 4.03398Z"
                        stroke="#C2CFE0"
                        stroke-width="1.4"
                      />
                      <rect
                        x="6.5"
                        y="3.33398"
                        width="1.16667"
                        height="13.3333"
                        fill="#C2CFE0"
                      />
                      <rect
                        x="12.333"
                        y="3.33398"
                        width="1.16667"
                        height="13.3333"
                        fill="#C2CFE0"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_182_12329">
                        <rect width="20" height="20" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>

                  <label>Legal Library</label>
                </a>
              </li>

              <li className="">
                <a href="#" className="">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_182_12329)">
                      <path
                        d="M2.50033 4.03398H17.5003C17.5721 4.03398 17.6337 4.09558 17.6337 4.16732V15.834C17.6337 15.9057 17.5721 15.9673 17.5003 15.9673H2.50033C2.42859 15.9673 2.36699 15.9057 2.36699 15.834V4.16732C2.36699 4.09558 2.42859 4.03398 2.50033 4.03398Z"
                        stroke="#C2CFE0"
                        stroke-width="1.4"
                      />
                      <rect
                        x="6.5"
                        y="3.33398"
                        width="1.16667"
                        height="13.3333"
                        fill="#C2CFE0"
                      />
                      <rect
                        x="12.333"
                        y="3.33398"
                        width="1.16667"
                        height="13.3333"
                        fill="#C2CFE0"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_182_12329">
                        <rect width="20" height="20" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>

                  <label>MLS</label>
                </a>
              </li>

              <li className="">
                <a href="#" className="">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_182_12329)">
                      <path
                        d="M2.50033 4.03398H17.5003C17.5721 4.03398 17.6337 4.09558 17.6337 4.16732V15.834C17.6337 15.9057 17.5721 15.9673 17.5003 15.9673H2.50033C2.42859 15.9673 2.36699 15.9057 2.36699 15.834V4.16732C2.36699 4.09558 2.42859 4.03398 2.50033 4.03398Z"
                        stroke="#C2CFE0"
                        stroke-width="1.4"
                      />
                      <rect
                        x="6.5"
                        y="3.33398"
                        width="1.16667"
                        height="13.3333"
                        fill="#C2CFE0"
                      />
                      <rect
                        x="12.333"
                        y="3.33398"
                        width="1.16667"
                        height="13.3333"
                        fill="#C2CFE0"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_182_12329">
                        <rect width="20" height="20" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>

                  <label>Title Search</label>
                </a>
              </li>
              <li className="">
                <a href="#" className="">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_182_12329)">
                      <path
                        d="M2.50033 4.03398H17.5003C17.5721 4.03398 17.6337 4.09558 17.6337 4.16732V15.834C17.6337 15.9057 17.5721 15.9673 17.5003 15.9673H2.50033C2.42859 15.9673 2.36699 15.9057 2.36699 15.834V4.16732C2.36699 4.09558 2.42859 4.03398 2.50033 4.03398Z"
                        stroke="#C2CFE0"
                        stroke-width="1.4"
                      />
                      <rect
                        x="6.5"
                        y="3.33398"
                        width="1.16667"
                        height="13.3333"
                        fill="#C2CFE0"
                      />
                      <rect
                        x="12.333"
                        y="3.33398"
                        width="1.16667"
                        height="13.3333"
                        fill="#C2CFE0"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_182_12329">
                        <rect width="20" height="20" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>

                  <label>Title Insurance</label>
                </a>
              </li>

              <li className="">
                <a href="#" className="">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_182_12323)">
                      <path
                        d="M4.99967 8.33398C4.08301 8.33398 3.33301 9.08398 3.33301 10.0007C3.33301 10.9173 4.08301 11.6673 4.99967 11.6673C5.91634 11.6673 6.66634 10.9173 6.66634 10.0007C6.66634 9.08398 5.91634 8.33398 4.99967 8.33398ZM14.9997 8.33398C14.083 8.33398 13.333 9.08398 13.333 10.0007C13.333 10.9173 14.083 11.6673 14.9997 11.6673C15.9163 11.6673 16.6663 10.9173 16.6663 10.0007C16.6663 9.08398 15.9163 8.33398 14.9997 8.33398ZM9.99967 8.33398C9.08301 8.33398 8.33301 9.08398 8.33301 10.0007C8.33301 10.9173 9.08301 11.6673 9.99967 11.6673C10.9163 11.6673 11.6663 10.9173 11.6663 10.0007C11.6663 9.08398 10.9163 8.33398 9.99967 8.33398Z"
                        fill="#C2CFE0"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_182_12323">
                        <rect width="20" height="20" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>

                  <label>Settings</label>
                </a>
              </li>
            </ul>
            <div className="end-ul">
              <hr className="h-color mx-2" />
              <ul className="list-unstyled ">
                <li className="">
                  <a href="#" className="">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M2 0C0.895431 0 0 0.89543 0 2V12C0 13.1046 0.89543 14 2 14H12C13.1046 14 14 13.1046 14 12V2C14 0.895431 13.1046 0 12 0H2ZM5 2C4.44772 2 4 2.44772 4 3V11C4 11.5523 4.44772 12 5 12C5.55228 12 6 11.5523 6 11V3C6 2.44772 5.55228 2 5 2Z"
                        fill="#C2CFE0"
                      />
                    </svg>
                    <label>Toggle sidebar</label>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="content">
        <nav className="navbar navbar-expand-md navbar-light bg-light">
          <ul className=" mb-2 mb-lg-0  navbar-nav profile-wrap">
            <li className="nav-item">
              <div className="search-box">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.9167 9.66667H10.2583L10.025 9.44167C10.8417 8.49167 11.3333 7.25833 11.3333 5.91667C11.3333 2.925 8.90833 0.5 5.91667 0.5C2.925 0.5 0.5 2.925 0.5 5.91667C0.5 8.90833 2.925 11.3333 5.91667 11.3333C7.25833 11.3333 8.49167 10.8417 9.44167 10.025L9.66667 10.2583V10.9167L13.8333 15.075L15.075 13.8333L10.9167 9.66667ZM5.91667 9.66667C3.84167 9.66667 2.16667 7.99167 2.16667 5.91667C2.16667 3.84167 3.84167 2.16667 5.91667 2.16667C7.99167 2.16667 9.66667 3.84167 9.66667 5.91667C9.66667 7.99167 7.99167 9.66667 5.91667 9.66667Z"
                    fill="#C2CFE0"
                  />
                </svg>

                <input type="text" placeholder="Global search"></input>
              </div>
            </li>
            <li className="nav-item">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19.5 18.2071V18.5H4.5V18.2071L6.35355 16.3536L6.5 16.2071V16V11C6.5 8.09437 8.02219 5.78092 10.6153 5.16653L11 5.07538V4.68V4C11 3.44614 11.4461 3 12 3C12.5539 3 13 3.44614 13 4V4.68V5.07506L13.3843 5.16644C15.9681 5.78076 17.5 8.10482 17.5 11V16V16.2071L17.6464 16.3536L19.5 18.2071ZM13.4135 20.5C13.2061 21.0806 12.6488 21.5 12 21.5C11.3443 21.5 10.7907 21.0813 10.5854 20.5H13.4135Z"
                  fill="white"
                  stroke="#C2CFE0"
                />
                <circle cx="17" cy="6" r="4.5" fill="#F7685B" stroke="white" />
              </svg>
            </li>
          </ul>
          <Nav className="flex-column custom-menubar">
            {/* <h3 className='menu-title'>Settings</h3> */}
            <Nav.Link onClick={Logout}>
              Logout{" "}
              <span className="ms-auto">
                <i className="icon icon-chevron-right"></i>
              </span>
            </Nav.Link>
          </Nav>
        </nav>
        <div className="dashboard-content">
          <div className="row gy-3 small-card-wrap gap">
            <div className="col-md-7 col-sm-12">
              <div className="static-table-container">
                <img src={dashtable} className="img-fluid"></img>
              </div>
              <div className="left-sec">
                <div className="card-image-wrapper">
                  <div className="dashboard-card">
                    <div className="top-title">
                      <label className="card-top-title">
                        Send benefit review by Sunday
                      </label>
                      <label className="card-top-right-title">Reminder</label>
                    </div>
                    <div className="secondary-title">
                      <label>
                        Due date: <span>December 23, 2018</span>
                      </label>
                    </div>
                    <div className="content-profile-wrap">
                      <div className="item">
                        <img src={profile} />
                        <div className="profile-sec card">
                          <label className="bold">Sierra Ferguson</label>
                        </div>
                      </div>
                      <button className="green">Completed</button>
                    </div>
                  </div>
                </div>
                <div className="card-image-wrapper">
                  <div className="dashboard-card">
                    <div className="top-title">
                      <label>Send benefit review by Sunday</label>
                      <label className="card-top-right-title">Call</label>
                    </div>
                    <div className="secondary-title">
                      <label>
                        Due date: <span>December 23, 2018</span>
                      </label>
                    </div>
                    <div className="content-profile-wrap">
                      <div className="item">
                        <img src={profile} />
                        <div className="profile-sec card">
                          <label className="bold">Sierra Ferguson</label>
                        </div>
                      </div>
                      <div className="circle-wrap">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            cx="6"
                            cy="6"
                            r="5"
                            stroke="#FFB946"
                            stroke-width="2"
                          />
                        </svg>
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            cx="6"
                            cy="6"
                            r="5"
                            stroke="#2ED47A"
                            stroke-width="2"
                          />
                        </svg>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clip-path="url(#clip0_2_3760)">
                            <path
                              d="M2 11.4997V13.9997H4.5L11.8733 6.62638L9.37333 4.12638L2 11.4997ZM13.8067 4.69305C14.0667 4.43305 14.0667 4.01305 13.8067 3.75305L12.2467 2.19305C11.9867 1.93305 11.5667 1.93305 11.3067 2.19305L10.0867 3.41305L12.5867 5.91305L13.8067 4.69305Z"
                              fill="#C2CFE0"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_2_3760">
                              <rect width="16" height="16" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>

                        <svg
                          width="10"
                          height="12"
                          viewBox="0 0 10 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M0.999674 10.6667C0.999674 11.4 1.59967 12 2.33301 12H7.66634C8.39967 12 8.99967 11.4 8.99967 10.6667V2.66667H0.999674V10.6667ZM9.66634 0.666667H7.33301L6.66634 0H3.33301L2.66634 0.666667H0.333008V2H9.66634V0.666667Z"
                            fill="#C2CFE0"
                          />
                        </svg>

                        <button className="red">Ended</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-image-wrapper">
                  <div className="dashboard-card">
                    <div className="top-title">
                      <label>Send benefit review by Sunday</label>
                      <label className="card-top-right-title">Event</label>
                    </div>
                    <div className="secondary-title">
                      <label>
                        Due date: <span>December 23, 2018</span>
                      </label>
                    </div>
                    <div className="content-profile-wrap">
                      <div className="item">
                        <img src={profile} />
                        <div className="profile-sec card">
                          <label className="bold">Sierra Ferguson</label>
                        </div>
                      </div>
                      <button className="green">completed</button>
                    </div>
                  </div>
                </div>
                <div className="show-more">
                  <label>Show more</label>
                </div>
              </div>
            </div>

            <div className="col-md-5 col-sm-12">
              <div className="right-sec">
                <div className="card-image-wrapper">
                  <img src={taskchart} alt="" />
                </div>
                <div className="card-image-wrapper">
                  <img src={deal} alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
