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
import packageService from "../services/packageService";
import tenantService from "../services/tenantService";
import Header from "../components/Headers/Header";
import Joi from "joi";
import validationService from "../services/validationService";
import _ from "lodash";
import toastService from "../services/toastService";
import alertService from "../services/alertService";
import authService from "../services/authService";

class PackageForm extends Component {

  state = {
    data: { id: 0, packageName: "", profileName: "", billingType: "", charges: "", duration: "", durationType: "", dataQuotaVolume: "", dataQuotaVolumeType: "", tenantId: "" },
    tenants: [ ],
    errors: {  },
    submitDisabled: false,
    formEnabled: false,
    dataLoaded: false
  };

  schema = Joi.object().keys({
    id: Joi.number().label("Package Id"),
    packageName: Joi.string().required(),
    profileName: Joi.string().required(),
    billingType: Joi.string().required().valid( 'Prepaid', 'Postpaid' ),
    charges: Joi.number().required().min(1),
    duration: Joi.number().required().min(1),
    durationType: Joi.string().required().valid( 'Year', 'Month', 'Week', 'Day', 'Hour', 'Minute' ),
    dataQuotaVolume: Joi.number().required().min(1),
    dataQuotaVolumeType: Joi.string().required().valid( 'TB', 'GB', 'MB', 'KB' ),
    tenantId: Joi.number().required().label("Tenant Id"),
  })

  userRole = authService.getCurrentRole();

  async componentDidMount() {
    this.setState({ formEnabled: false, dataLoaded: false });
    this.setState({ data: {id: 0, packageName: "", profileName: "", billingType: "", charges: "", duration: "", durationType: "", dataQuotaVolume:1, dataQuotaVolumeType: "TB", tenantId: "" } }); // temp solution
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
    const packageId = this.props.match.params.packageId;
    if(packageId && !isNaN(packageId)) {
      try{
        const {data: response} = await packageService.getPackage(packageId);
        if(response.data.package) {
          let packageData = _.pick( response.data.package, ["id", "packageName", "profileName", "billingType", "charges", "duration", "durationType", "dataQuotaVolume", "dataQuotaVolumeType", "tenantId"]);
          packageData.tenantId = packageData.tenantId+"";
          this.setState({ data: packageData });
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
        let response = await packageService.addPackage(data);
        alertService.show({ text: "Package Added", icon: "success", });
        console.log(response)
        this.setState({ submitDisabled: false });
        this.props.history.push(`/dashboard/packages`);
      }
      else {
        let response = await packageService.updatePackage(data);
        alertService.show({ text: "Package Updated", icon: "success", });
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
                      <h3 className="mb-0">{this.state.data.id===0? "Add Package": `Update Package: ${this.state.data.id}`}</h3>
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
                      Package information
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
                                name="packageName"
                                placeholder="Package Name"
                                type="text"
                                autoComplete="new-name"
                                value={this.state.data.packageName}
                                onChange={this.handleChange}
                            />
                            {this.state.errors.packageName && <small className="text-danger mx-1">{this.state.errors.packageName}</small>}
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="12">
                          <FormGroup>
                            <label
                                className="form-control-label"
                                htmlFor="input-profileName"
                            >
                              Profile Name
                            </label>
                            <Input
                                className="form-control-alternative"
                                id="input-profileName"
                                name="profileName"
                                placeholder="PPP Profile Name"
                                type="text"
                                autoComplete="new-profileName"
                                value={this.state.data.profileName}
                                onChange={this.handleChange}
                            />
                            {this.state.errors.profileName && <small className="text-danger mx-1">{this.state.errors.profileName}</small>}
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                                className="form-control-label"
                                htmlFor="input-charges"
                            >
                              Charges
                            </label>
                            <Input
                                className="form-control-alternative"
                                id="input-charges"
                                name="charges"
                                placeholder="Charges"
                                type="number"
                                autoComplete="new-charges"
                                value={this.state.data.charges}
                                onChange={this.handleChange}
                                min="1"
                            />
                            {this.state.errors.charges && <small className="text-danger mx-1">{this.state.errors.charges}</small>}
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label
                                className="form-control-label"
                                htmlFor="input-billingType"
                            >
                              Billing Type
                            </label>
                            <Input
                                className="form-control-alternative"
                                id="input-billingType"
                                name="billingType"
                                placeholder="Billing Type"
                                type="select"
                                autoComplete="new-billingType"
                                value={this.state.data.billingType}
                                onChange={this.handleChange}
                            >
                              <option value="">Select Billing Type</option>
                              <option key="Prepaid" value="Prepaid">Prepaid</option>
                              <option key="Postpaid" value="Postpaid">Postpaid</option>
                            </Input>
                            {this.state.errors.billingType && <small className="text-danger mx-1">Select a valid "Billing Type"</small>}
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                                className="form-control-label"
                                htmlFor="input-duration"
                            >
                              Duration
                            </label>
                            <Input
                                className="form-control-alternative"
                                id="input-duration"
                                name="duration"
                                placeholder="Duration"
                                type="number"
                                autoComplete="new-duration"
                                value={this.state.data.duration}
                                onChange={this.handleChange}
                                min="1"
                            />
                            {this.state.errors.duration && <small className="text-danger mx-1">{this.state.errors.duration}</small>}
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label
                                className="form-control-label"
                                htmlFor="input-durationType"
                            >
                              Duration Type
                            </label>
                            <Input
                                className="form-control-alternative"
                                id="input-durationType"
                                name="durationType"
                                placeholder="Duration Type"
                                type="select"
                                autoComplete="new-durationType"
                                value={this.state.data.durationType}
                                onChange={this.handleChange}
                            >
                              <option value="">Select Duration Type</option>
                              <option key="Year" value="Year">Year</option>
                              <option key="Month" value="Month">Month</option>
                              <option key="Week" value="Week">Week</option>
                              <option key="Day" value="Day">Day</option>
                              <option key="Hour" value="Hour">Hour</option>
                              <option key="Minute" value="Expire">Minute</option>
                            </Input>
                            {this.state.errors.durationType && <small className="text-danger mx-1">Select a valid "Duration Type"</small>}
                          </FormGroup>
                        </Col>
                      </Row>
                      {!this.state.data.dataQuotaVolume && <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                                className="form-control-label"
                                htmlFor="input-dataQuotaVolume"
                            >
                              Data Quota Volume
                            </label>
                            <Input
                                className="form-control-alternative"
                                id="input-dataQuotaVolume"
                                name="dataQuotaVolume"
                                placeholder="Data Quota Volume"
                                type="number"
                                autoComplete="new-dataQuotaVolume"
                                value={this.state.data.dataQuotaVolume}
                                onChange={this.handleChange}
                                min="1"
                            />
                            {this.state.errors.dataQuotaVolume && <small className="text-danger mx-1">{this.state.errors.dataQuotaVolume}</small>}
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label
                                className="form-control-label"
                                htmlFor="input-dataQuotaVolumeType"
                            >
                              Data Quota Volume Type
                            </label>
                            <Input
                                className="form-control-alternative"
                                id="input-dataQuotaVolumeType"
                                name="dataQuotaVolumeType"
                                placeholder="Data Quota Volume Type"
                                type="select"
                                autoComplete="new-dataQuotaVolumeType"
                                value={this.state.data.dataQuotaVolumeType}
                                onChange={this.handleChange}
                            >
                              <option value="">Select Data Quota Volume Type</option>
                              <option key="TB" value="TB">TB</option>
                              <option key="GB" value="GB">GB</option>
                              <option key="MB" value="MB">MB</option>
                              <option key="KB" value="KB">KB</option>
                            </Input>
                            {this.state.errors.dataQuotaVolumeType && <small className="text-danger mx-1">Select a valid "Data Quota Volume Type"</small>}
                          </FormGroup>
                        </Col>
                      </Row>}
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

export default PackageForm;
