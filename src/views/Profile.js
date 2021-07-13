import React, {Component} from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
} from "reactstrap";
import UserHeader from "./../components/Headers/UserHeader.js";
import Joi from "joi";
import authService from "../services/authService";
import Header from "../components/Headers/Header";
import tenantService from "../services/tenantService";
import _ from "lodash";
import toastService from "../services/toastService";
import validationService from "../services/validationService";
import alertService from "../services/alertService";



class ProfilePage extends Component {

  state = {
    data: { id: 0, firstName: "", lastName: "", userName: "", email: ""},
    errors: {  },
    submitDisabled: false,
    formEnabled: false,
    dataLoaded: false
  };

  schema = Joi.object().keys({
    firstName: Joi.string().required().label("First Name"),
    lastName: Joi.string().required().label("Last Name"),
    userName: Joi.string().required().label("UserName").custom((value, helpers) => {
      if (!value.match(/^(?=[a-zA-Z0-9._]{5,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/)) {
        return helpers.message('{{#label}} should be minimum 5 and maximum 20 characters, alphanumeric characters, numbers, underscore and dot');
      }
      return value;
    }),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required().label("Email"),
  });

  async componentDidMount() {
    this.setState({ formEnabled: false, dataLoaded: false });
    try{
      const {data: response} = await authService.getCurrentUserData();
      if(response.data) {
        this.setState({ data: _.pick( response.data.user, ["id", "firstName", "lastName", "userName", "email"] ) });
      }
    }
    catch (ex) {
      toastService.error(ex.message);
    }
    this.setState({ formEnabled: true, dataLoaded: true });
  }


  handleSubmit = () => {
    const errors = validationService.validate(this.state.data, this.schema);
    this.setState({ errors: errors || {} });
    console.log(errors)
    if (errors) return;
    this.doSubmit();
  };

  handleChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    const errorMessage = validationService.validateProperty(input, this.schema);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const data = { ...this.state.data };
    data[input.name] = input.value;

    this.setState({ data, errors });
  };

  doSubmit = async () => {
    this.setState({ submitDisabled: true });
  };


  render() {
    return (
      <>
        <Header />
        {/* Page content */}
        <Container className="mt--7" fluid>
          <Row>
            <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
              <Card className="card-profile shadow">
                <Row className="justify-content-center">
                  <Col className="order-lg-2" lg="3">
                    <div className="card-profile-image">
                      <a href="#pablo" onClick={(e) => e.preventDefault()}>
                        <img
                          alt="..."
                          className="rounded-circle"
                          src={
                            require("../assets/img/theme/team-4-800x800.jpg")
                              .default
                          }
                        />
                      </a>
                    </div>
                  </Col>
                </Row>
                <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                  {/*<div className="d-flex justify-content-between">*/}
                  {/*  <Button*/}
                  {/*    className="mr-4"*/}
                  {/*    color="info"*/}
                  {/*    href="#pablo"*/}
                  {/*    onClick={(e) => e.preventDefault()}*/}
                  {/*    size="sm"*/}
                  {/*  >*/}
                  {/*    Connect*/}
                  {/*  </Button>*/}
                  {/*  <Button*/}
                  {/*    className="float-right"*/}
                  {/*    color="default"*/}
                  {/*    href="#pablo"*/}
                  {/*    onClick={(e) => e.preventDefault()}*/}
                  {/*    size="sm"*/}
                  {/*  >*/}
                  {/*    Message*/}
                  {/*  </Button>*/}
                  {/*</div>*/}
                </CardHeader>
                <CardBody className="pt-0 pt-md-4">
                  <Row>
                    <div className="col">
                      <div className="card-profile-stats d-flex justify-content-center mt-md-5">

                      </div>
                    </div>
                  </Row>
                  <div className="text-center">
                    <h3 className="pb-0">
                      { this.state.data && this.state.data.firstName + " " + this.state.data.lastName}
                    </h3>
                    <p className="pt-0 mt-n3">
                      { this.state.data &&  this.state.data.userName}
                    </p>
                    <p className="pt-0 mt-n4 text-muted">
                      { this.state.data &&  this.state.data.email}
                    </p>
                    {/*<a href="#pablo" onClick={(e) => e.preventDefault()}>*/}
                    {/*  Show more*/}
                    {/*</a>*/}
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col className="order-xl-1" xl="8">
              <Card className="bg-secondary shadow">
                <CardHeader className="bg-white border-0">
                  <Row className="align-items-center">
                    <Col xs="8">
                      <h3 className="mb-0">My account</h3>
                    </Col>
                    <Col className="text-right" xs="4">
                      {/*<Button*/}
                      {/*  color="primary"*/}
                      {/*  href="#pablo"*/}
                      {/*  onClick={(e) => e.preventDefault()}*/}
                      {/*  size="sm"*/}
                      {/*>*/}
                      {/*  Update*/}
                      {/*</Button>*/}
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Form>
                    <h6 className="heading-small text-muted mb-4">
                      User information
                    </h6>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-first-name"
                          >
                            First name
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-first-name"
                            placeholder="First name"
                            type="text"
                            value={this.state.data.firstName}
                            onChange={this.handleChange}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-last-name"
                          >
                            Last name
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-last-name"
                            placeholder="Last name"
                            type="text"
                            value={this.state.data.lastName}
                            onChange={this.handleChange}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                              className="form-control-label"
                              htmlFor="input-username"
                          >
                            Username
                          </label>
                          <Input
                              className="form-control-alternative"
                              id="input-username"
                              placeholder="Username"
                              type="text"
                              value={this.state.data.userName}
                              onChange={this.handleChange}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                              className="form-control-label"
                              htmlFor="input-email"
                          >
                            Email address
                          </label>
                          <Input
                              className="form-control-alternative"
                              id="input-email"
                              placeholder="jesse@example.com"
                              type="email"
                              value={this.state.data.email}
                              onChange={this.handleChange}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default ProfilePage;
