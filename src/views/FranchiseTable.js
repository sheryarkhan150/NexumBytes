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
import franchiseService from "./../services/franchiseService"
import alertService from "../services/alertService";
import toastService from "../services/toastService";
import authService from "../services/authService";
import ConnectedAccounts from "./connectedAccounts";
import tenantService from "../services/tenantService";

class FranchiseTable extends Component {

  state = {
    franchises: [],
    dataLoaded: false
  };

  userRole = authService.getCurrentRole();

  async componentDidMount() {
    this.setState({ dataLoaded: false });
    try {
      const {data: response} = await franchiseService.getFranchises();
      if(response.data.franchises) {
        let franchises = [];
        response.data.franchises.forEach((item, index) => {
          if(this.userRole.role === 'admin') {
            franchises.push(item)
          }
          else if(this.userRole.role === 'tenant' &&
              this.userRole.tenantId === item.tenantId) {
            franchises.push(item)
          }
        });
        this.setState({ franchises: franchises });
      }
    }
    catch (ex){
      toastService.error(ex.message);
    }
    this.setState({ dataLoaded: true });
  }

  handleAdd = () => {
    this.props.history.push("/dashboard/franchises/add");
  };

  handleEdit = franchise => {
    this.props.history.push(`/dashboard/franchises/${franchise.id}/edit`);
  };

  handleDelete = franchise => {
    try{
      alertService.show({
        title: "Are you sure?",
        text: `Do you want to delete Franchise "${franchise.name}"`,
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
          .then((willDelete) => {
            if (willDelete) {
              let response = franchiseService.deleteFranchise(franchise.id);
              response.then((res) => {
                const franchises = this.state.franchises.filter(f => f.id !== res.data.data.franchise.id);
                this.setState({ franchises });
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
                        <h3 className="mb-0">Franchises</h3>
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
                      <th scope="col">Company</th>
                      <th scope="col">Connected Accounts</th>
                      <th scope="col"/>
                    </tr>
                    </thead>
                    <tbody>
                      {this.state.franchises && this.state.franchises.map(item => (
                        <tr key={item.id}>
                          <th scope="row">
                            <Media className="align-items-center">
                              <Media>
                                <span className="mb-0 text-sm">
                                  {item.name}
                                </span>
                              </Media>
                            </Media>
                          </th>
                          <td>
                            {item.tenant.companyName}
                          </td>
                          <td>
                            <ConnectedAccounts
                                label="Accounts"
                                title={"Franchise: " + item.companyName}
                                typeId={item.id}
                                getData = {() => franchiseService.getFranchiseUsers(item.id)}
                                addData = {(data) => franchiseService.addFranchiseUser(item.id, {userName: data})}
                                deleteData = {(userId) => franchiseService.deleteFranchiseUser(item.id, userId)}
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
                  {this.state.dataLoaded && this.state.franchises.length < 1 && <div className="text-center m-5" ><p>No data to show </p></div>}
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

export default FranchiseTable;
