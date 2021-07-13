import React, {Component, useState} from 'react';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    InputGroup,
    InputGroupAddon,
    Input,
    FormGroup,
    InputGroupText,
    Spinner,
    Form,
    Table,
    Media,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem, Card
} from 'reactstrap';
import Joi from "joi";
import validationService from "../services/validationService";
import authService from "../services/authService";
import toastService from "../services/toastService";
import customerService from "../services/customerService";
import tenantService from "../services/tenantService";

class ConnectedAccounts extends Component {

    state = {
        modal: false,
        data: {email: ""},
        errors: {},
        submitDisabled: false,
        accounts: [],
        dataLoaded: false,
    };

    schema = Joi.object().keys({
        email: Joi.string().required().label("UserName/Email"),
    });

    userRole = authService.getCurrentRole();

    async componentDidMount() {


    }

    async getData(){
        try {
            const {data: response} = await this.props.getData();
            if(response.data.users) {
                this.setState({ accounts: response.data.users });
            }
        } catch (ex) {
            toastService.error(ex.message);
        }
    }

    handleSubmit = () => {
        const errors = validationService.validate(this.state.data, this.schema);
        this.setState({errors: errors || {}});
        if (errors) return;

        this.doSubmit();
    };

    handleChange = ({currentTarget: input}) => {
        const errors = {...this.state.errors};
        const errorMessage = validationService.validateProperty(input, this.schema);
        if (errorMessage) errors[input.name] = errorMessage;
        else delete errors[input.name];

        const data = {...this.state.data};
        data[input.name] = input.value;

        this.setState({data, errors});
    };

    doSubmit = async () => {
        this.setState({submitDisabled: true});
        const {data} = this.state;
        try {
            let response = await this.props.addData(this.state.data.email);
            toastService.success("User Added");
            this.setState({data: {email: ""}});
            await this.getData();
        } catch (ex) {
            toastService.error(ex.message);
        }
        this.setState({submitDisabled: false});
    };

     toggle = async () => {
        this.setState({modal: !this.state.modal});
        if(!this.state.dataLoaded) {
            this.setState({dataLoaded: false});
            await this.getData();
            this.setState({dataLoaded: true});
        }
    };

    render() {
        return (
            <div>
                <Button color="primary" outline
                        onClick={(e) => {
                            e.preventDefault();
                            this.toggle();
                            console.log(this.state)
                        }}
                        size="sm"
                >
                    {this.props.label}
                </Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>{this.props.title}</ModalHeader>
                    <ModalBody>
                        <Form role="form">
                            <FormGroup>
                                <InputGroup>
                                    <Input
                                        name="email"
                                        placeholder="UserName/Email"
                                        type="email"
                                        autoComplete="new-email"
                                        value={this.state.data.email}
                                        onChange={this.handleChange}
                                    />
                                    <InputGroupAddon addonType="append">
                                        <Button color="primary"
                                                disabled={this.state.submitDisabled}
                                                onClick={e => {
                                                    e.preventDefault();
                                                    this.handleSubmit();
                                                }}>
                                            {this.state.submitDisabled &&
                                            <Spinner type="grow" color="light" size="sm"/>}
                                            {!this.state.submitDisabled && "Add"}
                                        </Button>
                                    </InputGroupAddon>
                                </InputGroup>
                                {/*{this.state.errors.email && <small className="text-danger mx-1">{this.state.errors.email}</small>}*/}
                            </FormGroup>
                        </Form>
                        <>
                            <Table className="align-items-center table-flush" responsive>
                                <thead className="thead-light">
                                <tr>
                                    <th scope="col">Name</th>
                                    <th scope="col">UserName</th>
                                    <th scope="col">Email</th>
                                    <th scope="col"/>
                                </tr>
                                </thead>
                                <tbody>
                                {this.state.accounts && this.state.accounts.map(item => (
                                    <tr key={item.id}>
                                        <th scope="row">
                                            <Media className="align-items-center">
                                                <Media>
                                                    <span className="mb-0 text-sm">
                                                      {item.user.firstName + " " + item.user.lastName }
                                                    </span>
                                                </Media>
                                            </Media>
                                        </th>
                                        <td>
                                            {item.user.userName}
                                        </td>
                                        <td>
                                            {item.user.email}
                                        </td>
                                        <td className="text-right">
                                            <UncontrolledDropdown>
                                                <DropdownToggle
                                                    className="btn-icon-only text-light"
                                                    role="button"
                                                    size="sm"
                                                    color=""
                                                    onClick={(e) => e.preventDefault()}
                                                >
                                                    <i className="fas fa-ellipsis-v"/>
                                                </DropdownToggle>
                                                <DropdownMenu className="dropdown-menu-arrow" right>
                                                    <DropdownItem
                                                        onClick={async (e) => {
                                                            e.preventDefault();

                                                            try {
                                                                await this.props.deleteData(item.id);
                                                                toastService.success("User Deleted");
                                                                await this.getData();
                                                            } catch (ex) {
                                                                toastService.error(ex.message);
                                                            }
                                                        }}
                                                    >
                                                        Delete
                                                    </DropdownItem>
                                                </DropdownMenu>
                                            </UncontrolledDropdown>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                                {}
                            </Table>
                        </>
                        {!this.state.dataLoaded &&
                        <div className="text-center m-5"><Spinner type="grow" color="primary"/></div>}
                        {this.state.dataLoaded && this.state.accounts.length < 1 &&
                        <div className="text-center m-5"><p>No User added </p></div>}

                    </ModalBody>
                    {/*<ModalFooter>*/}
                    {/*    /!*<Button color="secondary" onClick={this.toggle}>Close</Button>*!/*/}
                    {/*</ModalFooter>*/}
                </Modal>
            </div>
        );
    }

}

export default ConnectedAccounts;
