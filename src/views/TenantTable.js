import React, {Component} from "react";
import {
  Badge,
  Card,
  CardHeader,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Pagination,
  PaginationItem,
  PaginationLink,
  Table,
  Container,
  Row,
  Button, Spinner,
} from "reactstrap";
import Header from "./../components/Headers/Header.js";
import tenantService from "./../services/tenantService"
import alertService from "../services/alertService";
import toastService from "../services/toastService";
import authService from "../services/authService";
import ConnectedAccounts from "./connectedAccounts";

class TenantTable extends Component {

  state = {
    tenants: [],
    dataLoaded: false
  };

  userRole = authService.getCurrentRole();

  async componentDidMount() {
    this.setState({ dataLoaded: false });
    try {
      const {data: response} = await tenantService.getTenants();
      if(response.data.tenants) {
        let tenants = [];
        response.data.tenants.forEach((item, index) => {
          if(this.userRole.role === 'admin') {
            tenants.push(item)
          }
        });
        this.setState({ tenants: tenants });
      }
    }
    catch (ex){
      toastService.error(ex.message);
    }
    this.setState({ dataLoaded: true });

  }

  handleAdd = () => {
    this.props.history.push("/dashboard/tenants/add");
  };

  handleEdit = tenant => {
    this.props.history.push(`/dashboard/tenants/${tenant.id}/edit`);
  };

  handleDelete = tenant => {
    try{
      alertService.show({
        title: "Are you sure?",
        text: `Do you want to delete Tenant "${tenant.companyName}"`,
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
          .then((willDelete) => {
            if (willDelete) {
              let response = tenantService.deleteTenant(tenant.id);
              response.then((res) => {
                const tenants = this.state.tenants.filter(t => t.id !== res.data.data.tenant.id);
                this.setState({ tenants });
              }).catch((ex)=>{
                toastService.error(ex.message);
              });
            }
          });
    }
    catch (ex){
      toastService.error(ex.message);
    }

  };


  render() {
    return (
        <>
          <Header/>
          <Container className="mt--7" fluid>
            <Row>
              <div className="col">
                <Card className="shadow">
                  <CardHeader className="border-0">
                    <Row className="align-items-center">
                      <div className="col">
                        <h3 className="mb-0">Tenants</h3>
                      </div>
                      <div className="col text-right">
                        <Button
                            color="primary"
                            onClick={(e) => {
                              e.preventDefault();
                              this.handleAdd();
                            }}
                            size="sm"
                        >
                          Add
                        </Button>
                      </div>
                    </Row>
                  </CardHeader>
                  <Table className="align-items-center table-flush" responsive>
                    <thead className="thead-light">
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">Slogan</th>
                      <th scope="col">Copyright Text</th>
                      <th scope="col">Connected Accounts</th>
                      <th scope="col"/>
                    </tr>
                    </thead>
                    <tbody>
                      {this.state.tenants && this.state.tenants.map(item => (
                        <tr key={item.id}>
                          <th scope="row">
                            <Media className="align-items-center">
                              <Media>
                            <span className="mb-0 text-sm">
                              {item.companyName}
                            </span>
                              </Media>
                            </Media>
                          </th>
                          <td>
                            {item.companySlogan}
                          </td>
                          <td>
                            {item.copyrightText}
                          </td>
                          <td>
                            <ConnectedAccounts
                                label="Accounts"
                                title={"Tenant: " + item.companyName}
                                typeId={item.id}
                                getData = {() => tenantService.getTenantUsers(item.id)}
                                addData = {(data) => tenantService.addTenantUser(item.id, {userName: data})}
                                deleteData = {(userId) => tenantService.deleteTenantUser(item.id, userId)}
                            >
                            </ConnectedAccounts>
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
                                    onClick={(e) => {
                                      e.preventDefault();
                                      this.handleEdit(item);
                                    }}
                                >
                                  Edit
                                </DropdownItem>
                                <DropdownItem
                                    onClick={(e) => {
                                      e.preventDefault();
                                      this.handleDelete(item);
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
                  {!this.state.dataLoaded && <div className="text-center m-5" ><Spinner type="grow" color="primary" /></div>}
                  {this.state.dataLoaded && this.state.tenants.length < 1 && <div className="text-center m-5" ><p>No data to show </p></div>}
                  <CardFooter className="py-4">
                    <nav aria-label="...">
                      <Pagination
                          className="pagination justify-content-end mb-0"
                          listClassName="justify-content-end mb-0"
                      >
                        <PaginationItem className="disabled">
                          <PaginationLink
                              href="#pablo"
                              onClick={(e) => e.preventDefault()}
                              tabIndex="-1"
                          >
                            <i className="fas fa-angle-left"/>
                            <span className="sr-only">Previous</span>
                          </PaginationLink>
                        </PaginationItem>
                        <PaginationItem className="active">
                          <PaginationLink
                              href="#pablo"
                              onClick={(e) => e.preventDefault()}
                          >
                            1
                          </PaginationLink>
                        </PaginationItem>
                        <PaginationItem className="disabled">
                          <PaginationLink
                              href="#pablo"
                              onClick={(e) => e.preventDefault()}
                          >
                            <i className="fas fa-angle-right"/>
                            <span className="sr-only">Next</span>
                          </PaginationLink>
                        </PaginationItem>
                      </Pagination>
                    </nav>
                  </CardFooter>
                </Card>
              </div>
            </Row>
          </Container>
        </>
    );
  }
}

export default TenantTable;
