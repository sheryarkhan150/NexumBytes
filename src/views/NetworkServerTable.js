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
import networkServerService from "./../services/networkServerService"
import alertService from "../services/alertService";
import toastService from "../services/toastService";
import authService from "../services/authService";

class NetworkServerTable extends Component {

  state = {
    networkServers: [],
    dataLoaded: false
  };

  userRole = authService.getCurrentRole();

  async componentDidMount() {
    this.setState({ dataLoaded: false });
    try {
      const {data: response} = await networkServerService.getNetworkServers();
      if(response.data.networkServers) {
        let networkServers = [];
        response.data.networkServers.forEach((item, index) => {
          if(this.userRole.role === 'admin') {
            networkServers.push(item)
          }
          else if(this.userRole.role === 'tenant' &&
              this.userRole.tenantId === item.tenantId) {
            networkServers.push(item)
          }
        });
        this.setState({ networkServers: networkServers });
      }
    }
    catch (ex){
      toastService.error(ex.message);
    }
    this.setState({ dataLoaded: true });
  }

  handleAdd = () => {
    this.props.history.push("/dashboard/network-servers/add");
  };

  handleEdit = networkServer => {
    this.props.history.push(`/dashboard/network-servers/${networkServer.id}/edit`);
  };

  handleDelete = networkServer => {
    try{
      alertService.show({
        title: "Are you sure?",
        text: `Do you want to delete NAS "${networkServer.name}"`,
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
          .then((willDelete) => {
            if (willDelete) {
              let response = networkServerService.deleteNetworkServer(networkServer.id);
              response.then((res) => {
                const networkServers = this.state.networkServers.filter(ns => ns.id !== res.data.data.networkServer.id);
                this.setState({ networkServers });
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
                        <h3 className="mb-0">NAS</h3>
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
                      <th scope="col">UserName</th>
                      <th scope="col">IP Address</th>
                      <th scope="col">Port</th>
                      <th scope="col">API Port</th>
                      <th scope="col"/>
                    </tr>
                    </thead>
                    <tbody>
                      {this.state.networkServers && this.state.networkServers.map(item => (
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
                            {item.userName}
                          </td>
                          <td>
                            {item.ipAddress}
                          </td>
                          <td>
                            {item.port}
                          </td>
                          <td>
                            {item.apiPort}
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
                  {this.state.dataLoaded && this.state.networkServers.length < 1 && <div className="text-center m-5" ><p>No data to show </p></div>}
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

export default NetworkServerTable;
