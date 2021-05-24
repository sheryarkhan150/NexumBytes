import {
  Button,
  Card,
  Popconfirm,
  Skeleton,
  Table,
  Modal,
  Form,
  Input,
  notification,
} from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import axios from "../../../libs/axios";
import ColoredLine from "../../../variables/line";
import "./tenantprofile.css";
import { DeleteTwoTone, PlusOutlined } from "@ant-design/icons";
import Axios from "../../../libs/axios";
import TenantFranchises from "./TenantFranchises";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 10 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 8 },
};

const TenantProfile = () => {
  const { id } = useParams();
  const [userForm] = Form.useForm();
  const [tenant, setTenant] = useState({});
  const [tenantAdmins, setTenantAdmins] = useState([]);
  const [compName, setCompName] = useState(tenant.companyName);
  const [compSlogan, setCompSlogan] = useState(tenant.companySlogan);
  const [copyrights, setCopyrights] = useState(tenant.copyrightText);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const getTenant = useCallback(async () => {
    const response = await axios.get(`/tenant/${id}/user`);

    setTenant(response.data.data.tenant);
    setTenantAdmins(response.data.data.users);
  }, [id]);

  useEffect(() => {
    getTenant();
  }, [getTenant]);

  const columns = [
    {
      title: "ID",
      dataIndex: "userId",
      key: "userId",
      render: (text, record) => <Link to={`/user/${record.id}`}>{text}</Link>,
    },
    {
      title: "Role",
      key: "role",
      dataIndex: "role",
    },
    {
      title: "Delete",
      key: "delete",
      render: (_, record) => (
        <Popconfirm
          title="Sure to delete?"
          onConfirm={() => handleDelete(record.id)}
        >
          <Button danger>
            <DeleteTwoTone twoToneColor="#ff4d4f" />
          </Button>
        </Popconfirm>
      ),
    },
  ];
  const handleDelete = async (roleId) => {
    await Axios.delete(`/tenant/${id}/user/${roleId}`);
    getTenant();
  };

  const updateTenant = async (e) => {
    e.preventDefault();
    if (compName || compSlogan || copyrights) {
      await Axios.put(`/tenant/${id}`, {
        companyName: compName,
        companySlogan: compSlogan,
        copyrightText: copyrights,
      });

      getTenant();
      notification.success({
        message: "Tenant updated successfully",
        placement: "bottomRight",
      });
    } else {
      notification.error({
        message: "Nothing updated",
        placement: "bottomRight",
      });
    }
  };

  const showModal = () => {
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const onFinishFailed = () => {
    notification.error({ message: `Missing fields`, placement: "bottomRight" });
  };

  const addUser = async ({ userName }) => {
    setLoading(true);
    await axios.post(`/tenant/${tenant.id}/user`, { userName });
    getTenant();
    setLoading(false);
    handleCancel();
  };
  return (
    <>
      <div className="main-content">
        <Link to={`/tenants`}>
          <button
            className="btn "
            type="button"
            style={{
              backgroundImage: "linear-gradient(to right, #100059, #2a0042)",
              color: "white",
            }}
          >
            {`< Back`}
          </button>
        </Link>
        <Modal
          title="Title"
          centered
          visible={modalVisible}
          confirmLoading={loading}
          onCancel={handleCancel}
          footer={[]}
          // okButtonProps={{ disabled: disableOk }}
        >
          <Form
            {...layout}
            name="basic"
            initialValues={{ remember: false }}
            form={userForm}
            onFinish={addUser}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              label="Username"
              key="userName"
              name="userName"
              rules={[
                {
                  required: true,
                  message: "Username is required",
                },
              ]}
            >
              <div className="form-group focused">
                <Input />
              </div>
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit" loading={loading}>
                Add User
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        <div
          className="header pb-8 pt-5 pt-lg-8 d-flex align-items-center"
          style={{
            minHeight: "600px",
            backgroundImage:
              "url(https://images.unsplash.com/photo-1561233835-f937539b95b9?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=675&q=80)",
            backgroundSize: "cover",
            backgroundPosition: "center-top",
          }}
        >
          <span className="mask bg-gradient-default opacity-8"></span>

          {tenant ? (
            <>
              <div className="container-fluid d-flex align-items-center">
                <div className="row">
                  <div className="col-lg-7 col-md-10">
                    <Card
                      style={{
                        backgroundImage:
                          "linear-gradient(to right, #100059, #2a0042)",
                        borderRadius: "10px",
                        cursor: "auto",
                        width: "200%",
                        padding: "5%",
                      }}
                      hoverable
                      bordered={0}
                    >
                      <h1 className="display-2 text-white">
                        {tenant.companyName}
                      </h1>
                      <Table
                        columns={columns}
                        dataSource={tenantAdmins}
                        pagination={{ pageSize: 10 }}
                        key="table"
                        style={{
                          borderRadius: "15px",
                          width: "100%",
                          marginBottom: "5%",
                        }}
                      />
                      <p className="text-white mt-0 mb-5">
                        These are all the registered Tenant Admins
                        <Button
                          className="div-header-button"
                          type="primary"
                          shape="round"
                          onClick={() => showModal()}
                        >
                          Add User
                          <PlusOutlined />
                        </Button>
                      </p>
                    </Card>
                  </div>
                </div>
              </div>
              <div className="container-fluid mt--7">
                <div className="row">
                  <div className="col-xl-8 order-xl-1">
                    <div className="card-body">
                      <form onSubmit={(e) => updateTenant(e)}>
                        <div className="pl-lg-4">
                          <div className="row">
                            <div className="col-lg-6">
                              <h6 className="heading-small text-muted mb-4">
                                Tenant information
                              </h6>
                            </div>
                            <div className="col-lg-6">
                              <Link to={`/subscription-plans/${id}`}>
                                <button className="btn btn-info" type="button">
                                  Tenant Subscription
                                </button>
                              </Link>
                            </div>
                          </div>
                        </div>
                        <div className="pl-lg-4">
                          <div className="row">
                            <div className="col-lg-6">
                              <div className="form-group focused">
                                <label className="form-control-label">
                                  Company Name
                                </label>
                                <input
                                  type="text"
                                  id="input-Company Name"
                                  className="form-control form-control-alternative"
                                  placeholder={tenant.companyName}
                                  // value={compName}
                                  onChange={(e) => setCompName(e.target.value)}
                                />
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="form-group">
                                <label className="form-control-label">
                                  Company Slogan
                                </label>
                                <input
                                  type="text"
                                  id="input-slogan"
                                  className="form-control form-control-alternative"
                                  placeholder={tenant.companySlogan}
                                  // value={compSlogan}
                                  onChange={(e) =>
                                    setCompSlogan(e.target.value)
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <ColoredLine color="red" />
                        {/* <!-- Address --> */}
                        <h6 className="heading-small text-muted mb-4">
                          Copyrights Text
                        </h6>
                        <div className="pl-lg-4">
                          <div className="row">
                            <div className="col-md-12">
                              <div className="form-group focused">
                                <label className="form-control-label">
                                  Copyright
                                </label>
                                <input
                                  id="input-address"
                                  className="form-control form-control-alternative"
                                  placeholder={tenant.copyrightText}
                                  // value={copyrights}
                                  type="text"
                                  onChange={(e) =>
                                    setCopyrights(e.target.value)
                                  }
                                />
                              </div>
                            </div>
                          </div>
                          <button className="btn btn-info" type="submit">
                            Update Tenant
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <Card
                  style={{
                    backgroundImage:
                      "linear-gradient(to left, #36c3e3, #552173)",
                    borderRadius: "10px",
                    cursor: "auto",
                    padding: "0%",
                  }}
                  hoverable
                  bordered={0}
                >
                  <TenantFranchises tenantAdmins={tenantAdmins} tenantId={id} />
                </Card>
              </div>
            </>
          ) : (
            <Skeleton active />
          )}
        </div>
      </div>
    </>
  );
};

export default TenantProfile;
