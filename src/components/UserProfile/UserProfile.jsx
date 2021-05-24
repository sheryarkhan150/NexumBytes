import React, { useContext, useEffect, useState } from "react";
import { Redirect, useParams } from "react-router";
import { Input, Skeleton, Form, Modal, notification, Button } from "antd";
import OnlineContext from "../../context/online.context";
import axios from "../../libs/axios";
import "./userprofile.css";
import ColoredLine from "../../variables/line";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 10 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 8 },
};

const UserProfile = (props) => {
  const { online } = useContext(OnlineContext);
  const [userData, setUserData] = useState({});
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  // const id = props.match.params.id;

  const getUser = async (id) => {
    const user = await axios.get(`/user/${id}`);

    setUserData(user.data.data.user);
  };

  const updateUser = async ({
    firstName,
    lastName,
    userName,
    email,
    password,
  }) => {
    try {
      setLoading(true);
      await axios.put(`/user/${id}`, {
        firstName,
        lastName,
        userName,
        email,
        password,
      });

      notification.success({
        message: `Profile updated successfully`,
        placement: "bottomRight",
      });

      getUser(id);
      setLoading(false);
      setVisible(false);
    } catch (error) {
      setLoading(false);
      notification.error({
        message: `Could not upate profile`,
        placement: "bottomRight",
      });
    }
  };

  const onFinishFailed = () => {
    notification.error({ message: `Missing fields`, placement: "bottomRight" });
  };

  useEffect(() => {
    getUser(id);
  }, [props, id]);

  useEffect(() => {}, []);

  return (
    <>
      {online ? (
        <>
          {userData ? (
            <>
              <div className="main-content">
                <Modal
                  title="Update Profile"
                  visible={visible}
                  onCancel={() => setVisible(false)}
                  footer={[]}
                >
                  <Form
                    {...layout}
                    name="basic"
                    initialValues={{
                      firstName: userData.firstName,
                      lastName: userData.lastName,
                      userName: userData.userName,
                      email: userData.email,
                    }}
                    onFinish={updateUser}
                    onFinishFailed={onFinishFailed}
                  >
                    <Form.Item
                      label="First Name"
                      name="firstName"
                      rules={[
                        {
                          max: 50,
                          message:
                            "First name should not be more than 50 characters",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label="Last Name"
                      name="lastName"
                      rules={[
                        {
                          max: 50,
                          message:
                            "Last name should not be more than 50 characters",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label="Username"
                      name="userName"
                      rules={[
                        {
                          pattern: new RegExp(/^[a-z0-9_.]{5,20}$/gim),
                          message:
                            "Username should be minimum 5 and maximum 20 characters, alphanumeric characters, numbers, underscore and dot",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label="Email"
                      name="email"
                      rules={[
                        {
                          type: "email",
                          message: "Invalid email",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      label="Password"
                      name="password"
                      rules={[
                        {
                          pattern: new RegExp(
                            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,30}$/gm
                          ),
                          message:
                            "password should be minimum 8 and maximum 30 characters, at least one uppercase letter, one lowercase letter, one number and one special character",
                        },
                      ]}
                    >
                      <Input.Password />
                    </Form.Item>
                    <Form.Item {...tailLayout}>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                      >
                        Update User
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
                    backgroundPosition: "center top",
                  }}
                >
                  <span className="mask bg-gradient-default opacity-8"></span>

                  <div className="container-fluid d-flex align-items-center">
                    <div className="row">
                      <div className="col-lg-5 col-md-10">
                        <h1 className="display-2 text-white">{`Hello ${userData.firstName} ${userData.lastName}`}</h1>
                        <p className="text-white mt-0 mb-5 col-md-10">
                          This is your profile page. You can update your
                          information here
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="container-fluid mt--7">
                  <div className="row">
                    <div className="col-xl-4 order-xl-2 mb-5 mb-xl-0">
                      <div className="card card-profile shadow">
                        <div className="row justify-content-center">
                          <div className="col-lg-3 order-lg-2">
                            <div className="card-profile-image">
                              <img
                                src="https://image.shutterstock.com/image-vector/cartoon-vector-illustration-system-administrator-600w-265751342.jpg"
                                className="rounded-circle"
                                alt=""
                              />
                            </div>
                          </div>
                        </div>
                        <div className="card-header text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                          <div className="d-flex justify-content-between"></div>
                        </div>
                        <div className="card-body pt-0 pt-md-4">
                          <div className="row">
                            <div className="col">
                              <div className="card-profile-stats d-flex justify-content-center mt-md-5">
                                <div>
                                  <span className="heading">System Admin</span>
                                  <span className="description">
                                    System Admin
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-center">
                            <h3>
                              {`${userData.firstName} ${userData.lastName}`}
                              <span className="font-weight-light">, 25</span>
                            </h3>
                            <div className="h5 font-weight-300">
                              <i className="ni location_pin mr-2"></i>Lahore,
                              Pakistan
                            </div>
                            <div className="h5 mt-4">
                              <i className="ni business_briefcase-24 mr-2"></i>
                              System Admin - Telecom
                            </div>
                            <div>
                              <i className="ni education_hat mr-2"></i>
                              Comsats University Islamabad
                            </div>
                            <ColoredLine color="blue" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-8 order-xl-1">
                      <div className="card bg-secondary shadow">
                        <div className="card-header bg-white border-0">
                          <div className="row align-items-center">
                            <div className="col-8">
                              <h3 className="mb-0">My account</h3>
                            </div>
                            <div className="col-4 text-right">
                              <button
                                className="btn btn-sm btn-primary"
                                type="button"
                                onClick={() => setVisible(true)}
                              >
                                Update Profile
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="card-body">
                          <form>
                            <h6 className="heading-small text-muted mb-4">
                              User information
                            </h6>
                            <div className="pl-lg-4">
                              <div className="row">
                                <div className="col-lg-6">
                                  <div className="form-group focused">
                                    <label
                                      className="form-control-label"
                                      for="input-username"
                                    >
                                      Username
                                    </label>
                                    <input
                                      type="text"
                                      id="input-username"
                                      className="form-control form-control-alternative"
                                      placeholder="Username"
                                      readOnly
                                      value={userData.userName}
                                    />
                                  </div>
                                </div>
                                <div className="col-lg-6">
                                  <div className="form-group">
                                    <label
                                      className="form-control-label"
                                      for="input-email"
                                    >
                                      Email address
                                    </label>
                                    <input
                                      type="email"
                                      readOnly
                                      id="input-email"
                                      className="form-control form-control-alternative"
                                      placeholder="abc@example.com"
                                      value={userData.email}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-lg-6">
                                  <div className="form-group focused">
                                    <label
                                      className="form-control-label"
                                      for="input-first-name"
                                    >
                                      First name
                                    </label>
                                    <input
                                      type="text"
                                      id="input-first-name"
                                      className="form-control form-control-alternative"
                                      readOnly
                                      placeholder="First name"
                                      value={userData.firstName}
                                    />
                                  </div>
                                </div>
                                <div className="col-lg-6">
                                  <div className="form-group focused">
                                    <label
                                      className="form-control-label"
                                      for="input-last-name"
                                    >
                                      Last name
                                    </label>
                                    <input
                                      type="text"
                                      id="input-last-name"
                                      className="form-control form-control-alternative"
                                      placeholder="Last name"
                                      readOnly
                                      value={userData.lastName}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <ColoredLine color="blue" />
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <MainFooter /> */}
              </div>
            </>
          ) : (
            <Skeleton active />
          )}
        </>
      ) : (
        <Redirect to="/login" />
      )}
    </>
  );
};

export default UserProfile;
