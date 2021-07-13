import React, {Component} from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col, Spinner,
} from "reactstrap";
import {Redirect} from "react-router-dom";
import Joi from "joi";
import authService from "../services/authService";
import validationService from "../services/validationService";
import toastService from "../services/toastService";

class LoginForm extends Component {

  state = {
    data: { email: "", password: "" },
    errors: {  },
    submitDisabled: false,
  };

  schema = Joi.object().keys({
    email: Joi.string().required().label("Email"),
    password: Joi.string().required().label("Password"),
  });

  handleSubmit = () => {
    const errors = validationService.validate(this.state.data, this.schema);
    this.setState({ errors: errors || {} });
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
    const { data } = this.state;
    try{
      let response = await authService.login(data);
      console.log(response.data)
      authService.storeLoginData(response.data.data)
      toastService.success("Login Successful");
      this.setState({ submitDisabled: false });
      this.props.history.push("/dashboard");
    }
    catch (ex) {
      toastService.error(ex.message);
      this.setState({ submitDisabled: false });
    }
  };

  render() {
    if (authService.getCurrentUser()) return <Redirect to="/dashboard" />;
    return (
      <>
        <Col lg="5" md="7">
          <Card className="bg-secondary shadow border-0">
            <CardHeader className="bg-transparent text-center">
              <h3 className="mb-0">Login</h3>
            </CardHeader>
            <CardBody className="px-lg-5 py-lg-5">
              <Form role="form">
                <FormGroup className="mb-3">
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-email-83" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      name="email"
                      placeholder="Email"
                      type="email"
                      autoComplete="new-email"
                      value={this.state.data.email}
                      onChange={this.handleChange}
                    />
                  </InputGroup>
                  {this.state.errors.email && <small className="text-danger mx-1">{this.state.errors.email}</small>}
                </FormGroup>
                <FormGroup>
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-lock-circle-open" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      name="password"
                      placeholder="Password"
                      type="password"
                      autoComplete="new-password"
                      value={this.state.data.password}
                      onChange={this.handleChange}
                    />
                  </InputGroup>
                  {this.state.errors.password && <small className="text-danger mx-1">{this.state.errors.password}</small>}
                </FormGroup>
                {/*<div className="custom-control custom-control-alternative custom-checkbox">*/}
                {/*  <input*/}
                {/*    className="custom-control-input"*/}
                {/*    id=" customCheckLogin"*/}
                {/*    type="checkbox"*/}
                {/*  />*/}
                {/*  <label*/}
                {/*    className="custom-control-label"*/}
                {/*    htmlFor=" customCheckLogin"*/}
                {/*  >*/}
                {/*    <span className="text-muted">Remember me</span>*/}
                {/*  </label>*/}
                {/*</div>*/}
                <div className="text-center">
                  <Button
                      className="my-4"
                      color="primary"
                      type="button"
                      disabled={this.state.submitDisabled}
                      onClick={e => {
                        e.preventDefault();
                        this.handleSubmit();
                      }}>
                    {this.state.submitDisabled && <Spinner type="grow" color="light" size="sm" />}
                    {!this.state.submitDisabled && "Login"}
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
          {/*<Row className="mt-3">*/}
          {/*  <Col xs="6">*/}
          {/*    <a*/}
          {/*      className="text-light"*/}
          {/*      onClick={(e) => e.preventDefault()}*/}
          {/*    >*/}
          {/*      <small>Forgot password?</small>*/}
          {/*    </a>*/}
          {/*  </Col>*/}
          {/*  <Col className="text-right" xs="6">*/}
          {/*    <a*/}
          {/*      className="text-light"*/}
          {/*      onClick={(e) => e.preventDefault()}*/}
          {/*    >*/}
          {/*      <small>Create new account</small>*/}
          {/*    </a>*/}
          {/*  </Col>*/}
          {/*</Row>*/}
        </Col>
      </>
    );
  }
}

export default LoginForm;
