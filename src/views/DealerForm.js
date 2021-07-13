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
import authService from "../services/authService";

class DealerForm extends Component {

  state = {
    data: { id: 0, name: "", franchiseId: "", tenantId: "" },
    tenants: [ ],
    franchises: [ ],
    availableFranchises: [ ],
    errors: {  },
    submitDisabled: false,
    formEnabled: false,
    dataLoaded: false
  };

  schema = Joi.object().keys({
    id: Joi.number().label("Dealer Id"),
    name: Joi.string().required().label("Name"),
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
        this.setState({ franchises: responseFranchises.data.franchises.map(t => _.pick( t, ["id", "name", "tenantId"] )) });
      }
    }
    catch (ex) {
      toastService.error(ex.message);
    }
    const dealerId = this.props.match.params.dealerId;
    if(dealerId && !isNaN(dealerId)) {
      try{
        const {data: response} = await dealerService.getDealer(dealerId);
        if(response.data.dealer) {
          let dealer = _.pick( response.data.dealer, ["id", "name", "franchiseId"]);
          dealer.franchiseId = dealer.franchiseId+"";
          let franchises = this.state.franchises.filter(f => f.id == dealer.franchiseId);
          if(franchises.length > 0) {
            dealer.tenantId = franchises[0].tenantId+"";
          }
          this.setState({ data: dealer });
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

  };

  doSubmit = async () => {
    this.setState({ submitDisabled: true });
    const { data } = this.state;
    console.log(data)
    this.setState({ formEnabled: false });
    try{
      if(this.state.data.id===0){
        let response = await dealerService.addDealer(data);
        alertService.show({ text: "Dealer Added", icon: "success", });
        console.log(response)
        this.setState({ submitDisabled: false });
        this.props.history.push(`/dashboard/dealers`);
      }
      else {
        let response = await dealerService.updateDealer(data);
        alertService.show({ text: "Dealer Updated", icon: "success", });
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
                        <h3 className="mb-0">{this.state.data.id===0? "Add Dealer": `Update Dealer: ${this.state.data.id}`}</h3>
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
                        Dealer information
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
                                  placeholder="Dealer Name"
                                  type="text"
                                  autoComplete="new-name"
                                  value={this.state.data.name}
                                  onChange={this.handleChange}
                              />
                              {this.state.errors.name && <small className="text-danger mx-1">{this.state.errors.name}</small>}
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
                        { ['admin', 'tenant'].filter(role => role === this.userRole.role).length > 0 && <Row>
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

export default DealerForm;
