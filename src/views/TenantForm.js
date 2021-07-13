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
  Col, Spinner,
} from "reactstrap";
import tenantService from "../services/tenantService";
import Header from "../components/Headers/Header";
import Joi from "joi";
import validationService from "../services/validationService";
import _ from "lodash";
import toastService from "../services/toastService";
import alertService from "../services/alertService";

class TenantForm extends Component {

  state = {
    data: { id: 0, companyName: "", companySlogan: "", copyrightText: "" },
    errors: {  },
    submitDisabled: false,
    formEnabled: false,
    dataLoaded: false
  };

  schema = Joi.object().keys({
    id: Joi.number().label("Tenant Id"),
    companyName: Joi.string().required().label("Company Name"),
    companySlogan: Joi.string().required().label("Company Slogan"),
    copyrightText: Joi.string().required().label("Copyright Text"),
  });

  async componentDidMount() {
    this.setState({ formEnabled: false, dataLoaded: false });
    const tenantId = this.props.match.params.tenantId;
    if(tenantId && !isNaN(tenantId)) {
      try{
        const {data: response} = await tenantService.getTenant(tenantId);
        if(response.data.tenant) {
          this.setState({ data: _.pick( response.data.tenant, ["id", "companyName", "companySlogan", "copyrightText"] ) });
        }
      }
      catch (ex) {
        toastService.error(ex.message);
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
    try{
      if(this.state.data.id===0){
        let response = await tenantService.addTenant(data);
        alertService.show({ text: "Tenant Added", icon: "success", });
        console.log(response)
        this.setState({ submitDisabled: false });
        this.props.history.push(`/dashboard/tenants`);
      }
      else {
        let response = await tenantService.updateTenant(data);
        alertService.show({ text: "Tenant Updated", icon: "success", });
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
                      <h3 className="mb-0">{this.state.data.id===0? "Add Tenant": `Update Tenant: ${this.state.data.id}`}</h3>
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
                      Company information
                    </h6>
                    <div className="pl-lg-4">
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                                className="form-control-label"
                                htmlFor="input-companyName"
                            >
                              Name
                            </label>
                            <Input
                                className="form-control-alternative"
                                id="input-companyName"
                                name="companyName"
                                placeholder="Company Name"
                                type="text"
                                autoComplete="new-companyName"
                                value={this.state.data.companyName}
                                onChange={this.handleChange}
                            />
                            {this.state.errors.companyName && <small className="text-danger mx-1">{this.state.errors.companyName}</small>}
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label
                                className="form-control-label"
                                htmlFor="input-companySlogan"
                            >
                              Slogan
                            </label>
                            <Input
                                className="form-control-alternative"
                                id="input-companySlogan"
                                name="companySlogan"
                                placeholder="Company Slogan"
                                type="text"
                                autoComplete="new-companySlogan"
                                value={this.state.data.companySlogan}
                                onChange={this.handleChange}
                            />
                            {this.state.errors.companySlogan && <small className="text-danger mx-1">{this.state.errors.companySlogan}</small>}
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="12">
                          <FormGroup>
                            <label
                                className="form-control-label"
                                htmlFor="input-copyrightText"
                            >
                              Copyright Text
                            </label>
                            <Input
                                className="form-control-alternative"
                                id="input-copyrightText"
                                name="copyrightText"
                                placeholder="Copyright Text"
                                type="text"
                                autoComplete="new-copyrightText"
                                value={this.state.data.copyrightText}
                                onChange={this.handleChange}
                            />
                            {this.state.errors.copyrightText && <small className="text-danger mx-1">{this.state.errors.copyrightText}</small>}
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

export default TenantForm;
