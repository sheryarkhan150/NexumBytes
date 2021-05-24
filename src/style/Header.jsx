import { PageHeader, Button } from "antd";
import { Link } from "react-router-dom";
import React, { useContext } from "react";
import "./styles.css";
import OnlineContext from "../context/online.context";

const Header = () => {
  const { online } = useContext(OnlineContext);
  const logout = () => {
    localStorage.clear("token");
    window.location.replace("/login");
  };
  return (
    <>
      {online ? (
        <PageHeader
          className="site-page-header"
          title="Telecom"
          extra={[
            <Link key="Home" to="/">
              <Button>Home</Button>
            </Link>,
            <Link key="Tenants" to="/tenants">
              <Button>Tenant Admins</Button>
            </Link>,
            <Link key="profile" to="/profile">
              <Button>{"username"}</Button>
            </Link>,
            <Button type="primary" key="3" danger onClick={() => logout()}>
              Logout
            </Button>,
          ]}
        />
      ) : (
        <PageHeader
          className="site-page-header"
          title="Telecom"
          extra={[
            <Link key="register" to="/signup">
              <Button>Register</Button>
            </Link>,
            <Link key="login" to="/login">
              <Button type="primary" key="3">
                Login
              </Button>
            </Link>,
          ]}
        />
      )}
    </>
  );
};

export default Header;
