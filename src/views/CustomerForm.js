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
import franchiseService from "../services/franchiseService";
import networkServerService from "../services/networkServerService";
import tenantService from "../services/tenantService";
import Header from "../components/Headers/Header";
import Joi from "joi";
import validationService from "../services/validationService";
import _ from "lodash";
import toastService from "../services/toastService";
import alertService from "../services/alertService";
import dealerService from "../services/dealerService";
import packageService from "../services/packageService";
import customerService from "../services/customerService";
import authService from "../services/authService";

class CustomerForm extends Component {

  state = {
    data: { id: 0, name: "", nicNo: "", email:"", phoneNo: "", userName: "", secret: "", connectionType: "", packageId: "", onExpire: "", dealerId: "", franchiseId: "", tenantId: "" },
    tenants: [ ],
    franchises: [ ],
    dealers: [  ],
    packages: [  ],
    availableFranchises: [ ],
    availableDealers: [ ],
    availablePackages: [ ],
    errors: {  },
    submitDisabled: false,
    formEnabled: false,
    dataLoaded: false
  };

  schema = Joi.object().keys({
    id: Joi.number().label("Customer Id"),
    name: Joi.string().required().label("Name"),
    nicNo: Joi.string().allow('').label("NIC Number"),
    email: Joi.string().allow('').email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).label("Email"),
    phoneNo: Joi.string().allow('').label("Phone Number"),
    userName: Joi.string().label("UserName"),
    secret: Joi.string().label("Password"),
    connectionType: Joi.string().valid( 'Fiber', 'Ethernet', 'Hotspot').label("Connection Type"),
    packageId: Joi.number().required().label("Package Id"),
    onExpire: Joi.string().valid( 'AutoRenew', 'Expire'),
    dealerId: Joi.number().required().label("Dealer Id"),
    franchiseId: Joi.number().required().label("Franchise Id"),
    tenantId: Joi.number().required().label("Tenant Id"),
  })

  userRole = authService.getCurrentRole();

  async componentDidMount() {
    this.setState({ formEnabled: false, dataLoaded: false });
    try{
      const {data: responseTenant} = await tenantService.getTenants();
      console.log(responseTenant)
      if(responseTenant.data.tenants) {
        this.setState({ tenants: responseTenant.data.tenants.map(t => _.pick( t, ["id", "companyName"] )) });
      }
      const {data: responseFranchises} = await franchiseService.getFranchises();
      console.log(responseFranchises)
      if(responseFranchises.data.franchises) {
        this.setState({ franchises: responseFranchises.data.franchises.map(t => _.pick( t, ["id", "name", "networkServerId", "tenantId"] )) });
      }
      const {data: responseDealers} = await dealerService.getDealers();
      console.log(responseDealers)
      if(responseDealers.data.dealers) {
        this.setState({ dealers: responseDealers.data.dealers.map(t => _.pick( t, ["id", "name", "franchiseId"] )) });
      }
      const {data: responsePackages} = await packageService.getPackages();
      console.log(responsePackages)
      if(responsePackages.data.packages) {
        this.setState({ packages: responsePackages.data.packages.map(p => _.pick( p, ["id", "packageName", "tenantId"] )) });
      }
    }
    catch (ex) {
      toastService.error(ex.message);
    }
    const customerId = this.props.match.params.customerId;
    if(customerId && !isNaN(customerId)) {
      try{
        const {data: response} = await customerService.getCustomer(customerId);
        console.log(response)
        if(response.data.customer) {
          let customer = _.pick( response.data.customer, ["id", "name", "nicNo", "email", "phoneNo", "userName", "secret", "connectionType", "packageId", "onExpire", "dealerId"]);
          customer.dealerId = customer.dealerId+"";
          customer.packageId = customer.packageId+"";
          let dealers = this.state.dealers.filter(d => d.id == customer.dealerId);
          if(dealers.length > 0) {
            customer.franchiseId = dealers[0].franchiseId+"";
          }
          let franchises = this.state.franchises.filter(f => f.id == customer.franchiseId);
          if(franchises.length > 0) {
            customer.tenantId = franchises[0].tenantId+"";
          }
          this.setState({ data: customer });
        }
      }
      catch (ex) {
        toastService.error(ex.message);
      }
    }
    else {
      if(this.userRole.role === 'tenant'){
        this.setState({data: {...this.state.data, tenantId: this.userRole.tenantId}});
      }
      else if(this.userRole.role === 'franchise'){
        this.setState({data: {...this.state.data, tenantId: this.userRole.tenantId + "", franchiseId: this.userRole.franchiseId + ""}});
      }
      else if(this.userRole.role === 'dealer'){
        this.setState({data: {...this.state.data, tenantId: this.userRole.tenantId + "", franchiseId: this.userRole.franchiseId + "", dealerId: this.userRole.dealerId + ""}});
      }
    }
    this.handleFranchiseList(this.state.data.tenantId);
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

    if(input.name === "tenantId") {
      this.handleFranchiseList(input.value)
    }
    if(input.name === "franchiseId") {
      this.handleDealerList(input.value)
    }

  };

  doSubmit = async () => {
    this.setState({ submitDisabled: true });
    const { data } = this.state;
    console.log(data)
    this.setState({ formEnabled: false });
    try{
      if(this.state.data.id===0){
        let response = await customerService.addCustomer(data);
        alertService.show({ text: "Customers Added", icon: "success", });
        console.log(response)
        this.setState({ submitDisabled: false });
        this.props.history.push(`/dashboard/customers`);
      }
      else {
        let response = await customerService.updateCustomer(data);
        alertService.show({ text: "Customers Updated", icon: "success", });
        this.setState({ submitDisabled: false });
      }

    }
    catch (ex) {
      toastService.error(ex.message);
      this.setState({ submitDisabled: false });
    }
  };

  handleFranchiseList = (tenantId) => {
    console.log("Tenant: " + tenantId)
    let availableFranchises = this.state.franchises.filter(f => f.tenantId == tenantId);
    console.log(availableFranchises)
    this.setState({ availableFranchises });

    if(availableFranchises.filter(f=>f.tenantId == this.state.data.tenantId).length === 0){
      const data = { ...this.state.data };
      data.tenantId = tenantId;
      data.franchiseId = "";
      this.setState({ data });
      this.handleDealerList("");
      this.handlePackagesList(tenantId)
    }
    else {
      this.handleDealerList(this.state.data.franchiseId);
      this.handlePackagesList(tenantId)
    }


  }

  handleDealerList = (franchiseId) => {
    console.log("Franchise: " + franchiseId)
    let availableDealers = this.state.dealers.filter(d => d.franchiseId == franchiseId);
    console.log(availableDealers)
    this.setState({ availableDealers });

    console.log(availableDealers)
    if(availableDealers.filter(d=>d.franchiseId == this.state.data.franchiseId).length === 0){
      const data = { ...this.state.data };
      data.franchiseId = franchiseId;
      data.dealerId = "";
      this.setState({ data });
    }

  }

  handlePackagesList = (tenantId) => {
    console.log("Tenant: " + tenantId)
    let availablePackages = this.state.packages.filter(p => p.tenantId == tenantId);
    console.log(availablePackages)
    this.setState({ availablePackages });

    if(availablePackages.filter(p=>p.tenantId == this.state.data.tenantId).length === 0){
      const data = { ...this.state.data };
      data.tenantId = tenantId;
      data.franchiseId = "";
      this.setState({ data });
    }
  }


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
                        <h3 className="mb-0">{this.state.data.id===0? "Add Customer": `Update Customer: ${this.state.data.id}`}</h3>
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
                        Customer information
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
                                  placeholder="Customer Name"
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
                          <Col md="4">
                            <FormGroup>
                              <label
                                  className="form-control-label"
                                  htmlFor="input-nicNo"
                              >
                                NIC
                              </label>
                              <Input
                                  className="form-control-alternative"
                                  id="input-nicNo"
                                  name="nicNo"
                                  placeholder="Customer CNIC No"
                                  type="text"
                                  autoComplete="new-nicNo"
                                  value={this.state.data.nicNo}
                                  onChange={this.handleChange}
                              />
                              {this.state.errors.nicNo && <small className="text-danger mx-1">{this.state.errors.nicNo}</small>}
                            </FormGroup>
                          </Col>
                          <Col md="4">
                            <FormGroup>
                              <label
                                  className="form-control-label"
                                  htmlFor="input-email"
                              >
                                Email
                              </label>
                              <Input
                                  className="form-control-alternative"
                                  id="input-email"
                                  name="email"
                                  placeholder="Customer Email"
                                  type="text"
                                  autoComplete="new-email"
                                  value={this.state.data.email}
                                  onChange={this.handleChange}
                              />
                              {this.state.errors.email && <small className="text-danger mx-1">{this.state.errors.email}</small>}
                            </FormGroup>
                          </Col>
                          <Col md="4">
                            <FormGroup>
                              <label
                                  className="form-control-label"
                                  htmlFor="input-phoneNo"
                              >
                                Phone No
                              </label>
                              <Input
                                  className="form-control-alternative"
                                  id="input-phoneNo"
                                  name="phoneNo"
                                  placeholder="Customer Phone No"
                                  type="text"
                                  autoComplete="new-phoneNo"
                                  value={this.state.data.phoneNo}
                                  onChange={this.handleChange}
                              />
                              {this.state.errors.phoneNo && <small className="text-danger mx-1">{this.state.errors.phoneNo}</small>}
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
                                  placeholder="PPPOE UserName"
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
                                  htmlFor="input-secret"
                              >
                                PPPOE Password
                              </label>
                              <Input
                                  className="form-control-alternative"
                                  id="input-secret"
                                  name="secret"
                                  placeholder="PPPOE Password"
                                  type="password"
                                  autoComplete="new-secret"
                                  value={this.state.data.secret}
                                  onChange={this.handleChange}
                              />
                              {this.state.errors.secret && <small className="text-danger mx-1">{this.state.errors.secret}</small>}
                            </FormGroup>
                          </Col>
                        </Row>
                        {this.state.data.id===0 && ['admin'].filter(role => role === this.userRole.role).length > 0 &&  <Row>
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
                          {['admin', 'tenant'].filter(role => role === this.userRole.role).length > 0 && <Row>
                            <Col md="12">
                              <FormGroup>
                                <label
                                    className="form-control-label"
                                    htmlFor="input-franchise"
                                >
                                  Franchise
                                </label>
                                <Input
                                    className="form-control-alternative"
                                    id="input-franchise"
                                    name="franchiseId"
                                    placeholder="Franchise"
                                    type="select"
                                    autoComplete="new-franchise"
                                    value={this.state.data.franchiseId}
                                    onChange={this.handleChange}
                                >
                                  <option value="">Select Franchise</option>
                                  {this.state.availableFranchises.map(option => (
                                      <option key={option.id} value={option.id}>
                                        {option.name}
                                      </option>
                                  ))}
                                </Input>
                                {this.state.errors.franchiseId && <small className="text-danger mx-1">Select a valid "Franchise"</small>}
                              </FormGroup>
                            </Col>
                          </Row>}
                        {['admin', 'tenant', 'franchise'].filter(role => role === this.userRole.role).length > 0 && <Row>
                            <Col md="12">
                              <FormGroup>
                                <label
                                    className="form-control-label"
                                    htmlFor="input-dealer"
                                >
                                  Dealer
                                </label>
                                <Input
                                    className="form-control-alternative"
                                    id="input-dealer"
                                    name="dealerId"
                                    placeholder="Dealer"
                                    type="select"
                                    autoComplete="new-dealer"
                                    value={this.state.data.dealerId}
                                    onChange={this.handleChange}
                                >
                                  <option value="">Select Dealer</option>
                                  {this.state.availableDealers.map(option => (
                                      <option key={option.id} value={option.id}>
                                        {option.name}
                                      </option>
                                  ))}
                                </Input>
                                {this.state.errors.dealerId && <small className="text-danger mx-1">Select a valid "Dealer"</small>}
                              </FormGroup>
                            </Col>
                          </Row>}

                        <Row>
                          <Col md="4">
                            <FormGroup>
                              <label
                                  className="form-control-label"
                                  htmlFor="input-package"
                              >
                                Package
                              </label>
                              <Input
                                  className="form-control-alternative"
                                  id="input-package"
                                  name="packageId"
                                  placeholder="Package"
                                  type="select"
                                  autoComplete="new-package"
                                  value={this.state.data.packageId}
                                  onChange={this.handleChange}
                              >
                                <option value="">Select Package</option>
                                {this.state.availablePackages.map(option => (
                                    <option key={option.id} value={option.id}>
                                      {option.packageName}
                                    </option>
                                ))}
                              </Input>
                              {this.state.errors.packageId && <small className="text-danger mx-1">Select a valid "Package"</small>}
                            </FormGroup>
                          </Col>
                          <Col md="4">
                            <FormGroup>
                              <label
                                  className="form-control-label"
                                  htmlFor="input-onExpire"
                              >
                                On Expire
                              </label>
                              <Input
                                  className="form-control-alternative"
                                  id="input-onExpire"
                                  name="onExpire"
                                  placeholder="On Expire"
                                  type="select"
                                  autoComplete="new-onExpire"
                                  value={this.state.data.onExpire}
                                  onChange={this.handleChange}
                              >
                                <option value="">Select On Expire</option>
                                <option key="Expire" value="Expire">Expire</option>
                                <option key="AutoRenew" value="AutoRenew">Auto Renew</option>
                              </Input>
                              {this.state.errors.onExpire && <small className="text-danger mx-1">Select a valid "On Expire"</small>}
                            </FormGroup>
                          </Col>
                          <Col md="4">
                            <FormGroup>
                              <label
                                  className="form-control-label"
                                  htmlFor="input-connectionType"
                              >
                                Connection Type
                              </label>
                              <Input
                                  className="form-control-alternative"
                                  id="input-connectionType"
                                  name="connectionType"
                                  placeholder="Connection Type"
                                  type="select"
                                  autoComplete="new-connectionType"
                                  value={this.state.data.connectionType}
                                  onChange={this.handleChange}
                              >
                                <option value="">Select Connection Type</option>
                                <option key="Fiber" value="Fiber">Fiber</option>
                                <option key="Ethernet" value="Ethernet">Ethernet</option>
                                <option key="Hotspot" value="Hotspot">Hotspot</option>
                              </Input>
                              {this.state.errors.connectionType && <small className="text-danger mx-1">Select a valid "Connection Type"</small>}
                            </FormGroup>
                          </Col>
                        </Row>
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

export default CustomerForm;
