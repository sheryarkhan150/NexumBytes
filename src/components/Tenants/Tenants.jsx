import React, { useContext, useEffect, useState } from "react";
import axios from "../../libs/axios";
import { Popconfirm, Button, Table, Form, Input, notification } from "antd";
import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
import { Link, Redirect } from "react-router-dom";
import "./tenants.css";
import Modal from "antd/lib/modal/Modal";
import OnlineContext from "../../context/online.context";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 8 },
};

const Tenants = () => {
  const [tenantsData, setTenantsData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [companySlogan, setCompanySlogan] = useState("");
  const [copyrightText, setCopyRightText] = useState("");
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { online } = useContext(OnlineContext);

  const fetchTenants = async () => {
    const result = await axios.get("/tenant");
    setTenantsData(result.data.data.tenants);
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const handleDelete = async (tenantId) => {
    await axios.delete(`/tenant/${tenantId}`);
    fetchTenants();
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Company Name",
      dataIndex: "companyName",
      render: (text, record) => <Link to={`/tenant/${record.id}`}>{text}</Link>,
    },
    {
      title: "Company Slogan",
      dataIndex: "companySlogan",
    },
    {
      title: "Copyright Text",
      dataIndex: "copyrightText",
    },
    {
      title: "Delete",
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
    {
      title: "Edit",
      render: (_, record) => (
        <Button>
          <EditTwoTone />
        </Button>
      ),
    },
  ];

  const showModal = () => {
    setVisible(true);
  };

  const addTenant = async () => {
    if (companySlogan && companySlogan) {
      setConfirmLoading(true);
      await axios.post("/tenant", {
        companyName,
        companySlogan,
        copyrightText,
      });
      setVisible(false);
      setConfirmLoading(false);
      fetchTenants();
    } else {
      notification.error({
        message: `Missing fields`,
        placement: "bottomRight",
      });
    }
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const onFinishFailed = () => {
    notification.error({ message: `Missing fields`, placement: "bottomRight" });
  };

  return (
    <>
      {online ? (
        <div className=" main-content">
          <p className="display-2" style={{ textAlign: "center" }}>
            All Tenants
          </p>
          <div
            className="header pb-8 pt-5 pt-lg-8 d-flex align-items-center"
            style={{
              minHeight: "600px",
              backgroundImage:
                "url(https://images.unsplash.com/photo-1496167117681-944f702be1f4?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2089&q=80)",
              backgroundSize: "cover",
              backgroundPosition: "center top",
            }}
          >
            <span className="mask bg-gradient-default opacity-8"></span>
            <div className="container-fluid mt--7">
              <div className="row">
                <div className="col-xl-12 order-xl-1">
                  <div className="card bg-secondary shadow">
                    <div className="card-header bg-white border-0">
                      <div className="row align-items-center">
                        <Modal
                          title="Title"
                          centered
                          visible={visible}
                          confirmLoading={confirmLoading}
                          onCancel={handleCancel}
                          footer={[
                            <Button key="back" onClick={handleCancel}>
                              Return
                            </Button>,
                            <Button
                              key="addTenant"
                              type="primary"
                              onClick={addTenant}
                              loading={confirmLoading}
                              htmlType="submit"
                            >
                              Add Tenant
                            </Button>,
                          ]}
                          // okButtonProps={{ disabled: disableOk }}
                        >
                          {
                            <div>
                              <Form
                                {...layout}
                                name="basic"
                                initialValues={{ remember: true }}
                                onFinish={addTenant}
                                onFinishFailed={onFinishFailed}
                              >
                                <Form.Item
                                  label="Company Name"
                                  name="companyName"
                                  rules={[
                                    {
                                      required: true,
                                      message: "Company name is required",
                                    },
                                  ]}
                                >
                                  <Input
                                    onChange={(e) =>
                                      setCompanyName(e.target.value)
                                    }
                                  />
                                </Form.Item>
                                <Form.Item
                                  label="Company Slogan"
                                  name="companySlogan"
                                  rules={[
                                    {
                                      required: true,
                                      message: "Company Slogan is required",
                                    },
                                  ]}
                                >
                                  <Input
                                    onChange={(e) =>
                                      setCompanySlogan(e.target.value)
                                    }
                                  />
                                </Form.Item>
                                <Form.Item
                                  label="Copyrights Text"
                                  name="copyrightText"
                                >
                                  <Input
                                    onChange={(e) =>
                                      setCopyRightText(e.target.value)
                                    }
                                  />
                                </Form.Item>
                              </Form>
                            </div>
                          }
                        </Modal>
                        <div>
                          <span className="div-header">
                            <h2>Tenants List</h2>
                            <Button
                              className="div-header-button"
                              type="primary"
                              shape="round"
                              onClick={() => showModal()}
                            >
                              Add +
                            </Button>
                          </span>
                          <Table
                            columns={columns}
                            dataSource={tenantsData}
                            pagination={{ pageSize: 10 }}
                            scroll={{ y: 400 }}
                          />{" "}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Redirect to="/login" />
      )}
    </>
  );
};

export default Tenants;
