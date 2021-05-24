import React from "react";
import { Link } from "react-router-dom";
import MainFooter from "../style/MainFooter";
import "./authlayout.css";

const AuthLayout = ({ ComponentFromApp, setToken }) => {
  return (
    <>
      <div className="bg-default">
        <div className="main-content">
          <nav className="navbar navbar-top navbar-horizontal navbar-expand-md navbar-dark">
            <div className="container px-4">
              <Link to="/login" className="navbar-brand">
                NexumBytes
              </Link>

              <div
                className="collapse navbar-collapse"
                id="navbar-collapse-main"
              >
                <div className="navbar-collapse-header d-md-none">
                  <div className="row">
                    <div className="col-6 collapse-brand">
                      <Link to="/">NexumBytes</Link>
                    </div>
                    <div className="col-6 collapse-close">
                      <button
                        type="button"
                        className="navbar-toggler"
                        data-toggle="collapse"
                        data-target="#navbar-collapse-main"
                        aria-controls="sidenav-main"
                        aria-expanded="false"
                        aria-label="Toggle sidenav"
                      >
                        <span></span>
                        <span></span>
                      </button>
                    </div>
                  </div>
                </div>

                <ul className="navbar-nav ml-auto">
                  <li className="nav-item">
                    <Link to="/signup" className="nav-link nav-link-icon">
                      <i className="ni ni-circle-08"></i>
                      <span className="nav-link-inner--text">Register</span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/login" className="nav-link nav-link-icon">
                      <i className="ni ni-key-25"></i>
                      <span className="nav-link-inner--text">Login</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </nav>

          <div className="header bg-gradient-primary py-7 py-lg-8">
            <div className="container">
              <div className="header-body text-center mb-7">
                <div className="row justify-content-center">
                  <div className="col-lg-5 col-md-6">
                    <h1 className="text-white">Welcome!</h1>
                    <p className="text-lead text-light">
                      ISP Solution for everyone
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="separator separator-bottom separator-skew zindex-100">
              <svg
                x="0"
                y="0"
                viewBox="0 0 2560 100"
                preserveAspectRatio="none"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
              >
                <polygon
                  className="fill-default"
                  points="2560 0 2560 100 0 100"
                ></polygon>
              </svg>
            </div>
          </div>

          <div className="container mt--8 pb-5">
            <div className="row justify-content-center">
              <div className="col-lg-5 col-md-7">
                {/* COMPONENT FROM THE APP */}
                <div className="card bg-secondary shadow border-0">
                  <div className="card-body px-lg-5 py-lg-5">
                    <ComponentFromApp setToken={setToken} />{" "}
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col-6">
                    <Link className="text-light" to="/reset-password">
                      <small>Forgot password?</small>
                    </Link>
                  </div>
                  <div className="col-6 text-right">
                    <Link to="/signup" className="text-light">
                      <small>Create new account</small>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <MainFooter />
      </div>
    </>
  );
};

export default AuthLayout;
