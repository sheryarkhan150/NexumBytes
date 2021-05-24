import React from "react";

const LoginLayout = () => {
  return (
    <>
      <body className="bg-default">
        <div className="main-content">
          <nav className="navbar navbar-top navbar-horizontal navbar-expand-md navbar-dark">
            <div className="container px-4">
              <a
                className="navbar-brand"
                href="https://www.creative-tim.com/product/argon-dashboard"
                target="_blank"
              >
                Argon
              </a>
              <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbar-collapse-main"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div
                className="collapse navbar-collapse"
                id="navbar-collapse-main"
              >
                <div className="navbar-collapse-header d-md-none">
                  <div className="row">
                    <div className="col-6 collapse-brand">
                      <a href="../index.html">Argon</a>
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
                    <a
                      className="nav-link nav-link-icon"
                      href="https://www.creative-tim.com/product/argon-dashboard"
                      target="_blank"
                    >
                      <i className="ni ni-planet"></i>
                      <span className="nav-link-inner--text">Dashboard</span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link nav-link-icon"
                      href="https://www.creative-tim.com/product/argon-dashboard"
                      target="_blank"
                    >
                      <i className="ni ni-circle-08"></i>
                      <span className="nav-link-inner--text">Register</span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link nav-link-icon"
                      href="https://www.creative-tim.com/product/argon-dashboard"
                      target="_blank"
                    >
                      <i className="ni ni-key-25"></i>
                      <span className="nav-link-inner--text">Login</span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link nav-link-icon"
                      href="https://www.creative-tim.com/product/argon-dashboard"
                      target="_blank"
                    >
                      <i className="ni ni-single-02"></i>
                      <span className="nav-link-inner--text">Profile</span>
                    </a>
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
                      Use these awesome forms to login or create new account in
                      your project for free.
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
                <div className="card bg-secondary shadow border-0">
                  <div className="card-header bg-transparent pb-5">
                    <div className="text-muted text-center mt-2 mb-3">
                      <small>Sign in with</small>
                    </div>
                    <div className="btn-wrapper text-center">
                      <a href="#" className="btn btn-neutral btn-icon">
                        <span className="btn-inner--icon">
                          <img src="https://raw.githack.com/creativetimofficial/argon-dashboard/master/assets/img/icons/common/github.svg" />
                        </span>
                        <span className="btn-inner--text">Github</span>
                      </a>
                      <a href="#" className="btn btn-neutral btn-icon">
                        <span className="btn-inner--icon">
                          <img src="https://raw.githack.com/creativetimofficial/argon-dashboard/master/assets/img/icons/common/google.svg" />
                        </span>
                        <span className="btn-inner--text">Google</span>
                      </a>
                    </div>
                  </div>
                  <div className="card-body px-lg-5 py-lg-5">
                    <div className="text-center text-muted mb-4">
                      <small>Or sign in with credentials</small>
                    </div>
                    <form role="form">
                      <div className="form-group mb-3">
                        <div className="input-group input-group-alternative">
                          <div className="input-group-prepend">
                            <span className="input-group-text">
                              <i className="ni ni-email-83"></i>
                            </span>
                          </div>
                          <input
                            className="form-control"
                            placeholder="Email"
                            type="email"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="input-group input-group-alternative">
                          <div className="input-group-prepend">
                            <span className="input-group-text">
                              <i className="ni ni-lock-circle-open"></i>
                            </span>
                          </div>
                          <input
                            className="form-control"
                            placeholder="Password"
                            type="password"
                          />
                        </div>
                      </div>
                      <div className="custom-control custom-control-alternative custom-checkbox">
                        <input
                          className="custom-control-input"
                          id=" customCheckLogin"
                          type="checkbox"
                        />
                        <label
                          className="custom-control-label"
                          for=" customCheckLogin"
                        >
                          <span className="text-muted">Remember me</span>
                        </label>
                      </div>
                      <div className="text-center">
                        <button type="button" className="btn btn-primary my-4">
                          Sign in
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-6">
                    <a href="#" className="text-light">
                      <small>Forgot password?</small>
                    </a>
                  </div>
                  <div className="col-6 text-right">
                    <a href="#" className="text-light">
                      <small>Create new account</small>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="py-5">
          <div className="container">
            <div className="row align-items-center justify-content-xl-between">
              <div className="col-xl-6">
                <div className="copyright text-center text-xl-left text-muted">
                  &copy; 2019{" "}
                  <a
                    href="https://www.creative-tim.com/product/argon-dashboard"
                    className="font-weight-bold ml-1"
                    target="_blank"
                  >
                    Argon Dashboard
                  </a>
                </div>
              </div>
              <div className="col-xl-6">
                <ul className="nav nav-footer justify-content-center justify-content-xl-end">
                  <li className="nav-item">
                    <a
                      href="https://www.creative-tim.com"
                      className="nav-link"
                      target="_blank"
                    >
                      Creative Tim
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      href="https://www.creative-tim.com/presentation"
                      className="nav-link"
                      target="_blank"
                    >
                      About Us
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      href="http://blog.creative-tim.com"
                      className="nav-link"
                      target="_blank"
                    >
                      Blog
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </>
  );
};

export default LoginLayout;
