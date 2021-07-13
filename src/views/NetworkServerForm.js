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
  Spinner,
} from "reactstrap";
import networkServerService from "../services/networkServerService";
import tenantService from "../services/tenantService";
import Header from "../components/Headers/Header";
import Joi from "joi";
import validationService from "../services/validationService";
import _ from "lodash";
import toastService from "../services/toastService";
import alertService from "../services/alertService";
import authService from "../services/authService";

class NetworkServerForm extends Component {

  state = {
    data: { id: 0, name: "", userName: "", password: "", secret: "", ipAddress: "", port: "", apiPort: "", tenantId: "" },
    tenants: [ ],
    errors: {  },
    submitDisabled: false,
    formEnabled: false,
    dataLoaded: false
  };

  schema = Joi.object().keys({
    id: Joi.number().label("NAS Id"),
    name: Joi.string().required().label("Name"),
    userName: Joi.string().required().label("Server Username"),
    password: Joi.string().required().label("Server Password"),
    secret: Joi.string().required().label("Radius Secret"),
    ipAddress: Joi.string().required().label("Server IP Address").custom((value, helpers) => {
      if (!value.match(/\b((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$)){4}\b/)) {
        return helpers.message('{{#label}} must be a valid IP Address');
      }
      return value;
    }),
    port: Joi.string().required().label("Server Port").custom((value, helpers) => {
      if (!value.match(/^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/)) {
        return helpers.message('{{#label}} must be a valid Port Number');
      }
      return value;
    }),
    apiPort: Joi.string().label("API Port").custom((value, helpers) => {
      if (!value.match(/^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/)) {
        return helpers.message('{{#label}} must be a valid Port Number');
      }
      return value;
    }),
    tenantId: Joi.number().required().label("Tenant Id"),
  })

  userRole = authService.getCurrentRole();

  async componentDidMount() {
    this.setState({ formEnabled: false, dataLoaded: false });
    try{
      const {data: response} = await tenantService.getTenants();
      console.log(response)
      if(response.data.tenants) {
        this.setState({ tenants: response.data.tenants.map(t => _.pick( t, ["id", "companyName"] )) });
      }
    }
    catch (ex) {
      toastService.error(ex.message);
    }
    const nasId = this.props.match.params.nasId;
    if(nasId && !isNaN(nasId)) {
      try{
        const {data: response} = await networkServerService.getNetworkServer(nasId);
        if(response.data.networkServer) {
          let networkServer = _.pick( response.data.networkServer, ["id", "name", "userName", "password", "secret", "ipAddress", "port", "apiPort", "tenantId"]);
          networkServer.tenantId = networkServer.tenantId+"";
          this.setState({ data: networkServer });
        }
      }
      catch (ex) {
        toastService.error(ex.message);
      }
    }
    else {
      if(this.userRole.role === 'tenant'){
        this.setState({data: {...this.state.data, tenantId: this.userRole.tenantId + ""}});
      }
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
    const { data } = this.state;
    console.log(data)
    this.setState({ formEnabled: false });
    try{
      if(this.state.data.id===0){
        let response = await networkServerService.addNetworkServer(data);
        alertService.show({ text: "NAS Added", icon: "success", });
        console.log(response)
        this.setState({ submitDisabled: false });
        this.props.history.push(`/dashboard/network-servers`);
      }
      else {
        let response = await networkServerService.updateNetworkServer(data);
        alertService.show({ text: "NAS Updated", icon: "success", });
        this.setState({ submitDisabled: false });
      }

    }
    catch (ex) {
      toastService.error(ex.message);
      this.setState({ submitDisabled: false });
    }
  };


  render() {
    return (
      <>
        <Header/>
        <Container className="mt--7" fluid>
          <Row>
            <Col className="order-xl-1">
              <Card className="bg-secondary shadow">
                <CardHeader className="bg-white border-0">
                  <Row className="align-items-center">
                    <Col xs="8">
                      <h3 className="mb-0">{this.state.data.id===0? "Add NAS": `Update NAS: ${this.state.data.id}`}</h3>
                    </Col>
                    <div className="col text-right">
                      <Button
                          color="primary"
                          disabled={this.state.submitDisabled}
                          onClick={(e) => {
                            e.preventDefault();
                            this.handleSubmit();
                          }}
                          size="sm"
                      >
                        {this.state.submitDisabled && <Spinner type="grow" color="light" size="sm" />}

                        {this.state.data.id===0? "Save": "Update"}
                      </Button>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  {this.state.dataLoaded &&
                  <Form>
                    <h6 className="heading-small text-muted mb-4">
                      NAS information
                    </h6>
                    <div className="pl-lg-4">
                      <Row>
                        <Col md="12">
                          <FormGroup>
                            <label
                                className="form-control-label"
                                htmlFor="input-name"
                            >
                              Name
                            </label>
                            <Input
                                className="form-control-alternative"
                                id="input-name"
                                name="name"
                                placeholder="NAS Name"
                                type="text"
                                autoComplete="new-name"
                                value={this.state.data.name}
                                onChange={this.handleChange}
                            />
                            {this.state.errors.name && <small className="text-danger mx-1">{this.state.errors.name}</small>}
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
                                name="userName"
                                placeholder="Server UserName"
                                type="text"
                                autoComplete="new-userName"
                                value={this.state.data.userName}
                                onChange={this.handleChange}
                            />
                            {this.state.errors.userName && <small className="text-danger mx-1">{this.state.errors.userName}</small>}
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label
                                className="form-control-label"
                                htmlFor="input-password"
                            >
                              Password
                            </label>
                            <Input
                                className="form-control-alternative"
                                id="input-password"
                                name="password"
                                placeholder="Server Password"
                                type="password"
                                autoComplete="new-password"
                                value={this.state.data.password}
                                onChange={this.handleChange}
                            />
                            {this.state.errors.password && <small className="text-danger mx-1">{this.state.errors.password}</small>}
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="12">
                          <FormGroup>
                            <label
                                className="form-control-label"
                                htmlFor="input-secret"
                            >
                              Secrets
                            </label>
                            <Input
                                className="form-control-alternative"
                                id="input-secret"
                                name="secret"
                                placeholder="Radius Secret"
                                type="text"
                                autoComplete="new-secret"
                                value={this.state.data.secret}
                                onChange={this.handleChange}
                            />
                            {this.state.errors.secret && <small className="text-danger mx-1">{this.state.errors.secret}</small>}
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="4">
                          <FormGroup>
                            <label
                                className="form-control-label"
                                htmlFor="input-ip"
                            >
                              IP Address
                            </label>
                            <Input
                                className="form-control-alternative"
                                id="input-ip"
                                name="ipAddress"
                                placeholder="Server IP Address"
                                type="text"
                                autoComplete="new-ip"
                                value={this.state.data.ipAddress}
                                onChange={this.handleChange}
                            />
                            {this.state.errors.ipAddress && <small className="text-danger mx-1">{this.state.errors.ipAddress}</small>}
                          </FormGroup>
                        </Col>
                        <Col lg="4">
                          <FormGroup>
                            <label
                                className="form-control-label"
                                htmlFor="input-port"
                            >
                              Server Port
                            </label>
                            <Input
                                className="form-control-alternative"
                                id="input-port"
                                name="port"
                                placeholder="Server Port"
                                type="text"
                                autoComplete="new-port"
                                value={this.state.data.port}
                                onChange={this.handleChange}
                            />
                            {this.state.errors.port && <small className="text-danger mx-1">{this.state.errors.port}</small>}
                          </FormGroup>
                        </Col>
                        <Col lg="4">
                          <FormGroup>
                            <label
                                className="form-control-label"
                                htmlFor="input-apiPort"
                            >
                              API Port
                            </label>
                            <Input
                                className="form-control-alternative"
                                id="input-apiPort"
                                name="apiPort"
                                placeholder="API Port"
                                type="text"
                                autoComplete="new-apiPort"
                                value={this.state.data.apiPort}
                                onChange={this.handleChange}
                            />
                            {this.state.errors.apiPort && <small className="text-danger mx-1">{this.state.errors.apiPort}</small>}
                          </FormGroup>
                        </Col>
                      </Row>
                      {this.state.data.id===0 && ['admin'].filter(role => role === this.userRole.role).length > 0 && <Row>
                        <Col md="12">
                          <FormGroup>
                            <label
                                className="form-control-label"
                                htmlFor="input-tenant"
                            >
                              Tenant
                            </label>
                            <Input
                                className="form-control-alternative"
                                id="input-tenant"
                                name="tenantId"
                                placeholder="Tenant"
                                type="select"
                                autoComplete="new-tenant"
                                value={this.state.data.tenantId}
                                onChange={this.handleChange}
                            >
                              <option value="">Select Tenant</option>
                              {this.state.tenants.map(option => (
                                  <option key={option.id} value={option.id}>
                                    {option.companyName}
                                  </option>
                              ))}
                            </Input>
                            {this.state.errors.tenantId && <small className="text-danger mx-1">Select a valid "Tenant"</small>}
                          </FormGroup>
                        </Col>
                      </Row>}
                    </div>
                  </Form>}
                  {!this.state.dataLoaded && <div className="text-center m-5" ><Spinner type="grow" color="primary" /></div>}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
};

export default NetworkServerForm;
