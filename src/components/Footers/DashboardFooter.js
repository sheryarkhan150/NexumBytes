import React from "react";
import { Container, Row, Col, Nav, NavItem, NavLink } from "reactstrap";

const DashboardFooter = () => {
  return (
    <footer className="footer">
      <Row className="align-items-center justify-content-xl-between">
        <Col xl="6">
          <div className="copyright text-center text-xl-left text-muted">
            © {new Date().getFullYear()}{" "}
            <a
                className="font-weight-bold ml-1"
                href="/"
                target="_blank"
            >
              NexumBytes
            </a>
          </div>
        </Col>
        <Col xl="6">
          <Nav className="nav-footer justify-content-center justify-content-xl-end">
            <NavItem>
              <NavLink
                  href="/about-us"
                  target="_blank"
              >
                About Us
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                  href="/contact-us"
                  target="_blank"
              >
                Contact Us
              </NavLink>
            </NavItem>
          </Nav>
        </Col>
      </Row>
    </footer>
  );
};

export default DashboardFooter;
