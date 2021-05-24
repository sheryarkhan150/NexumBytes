import React, { useContext, useState } from "react";
import { Redirect } from "react-router-dom";
import { Form, Input, Button, message } from "antd";
import Axios from "../../libs/axios";
import OnlineContext from "../../context/online.context";

const layout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 8 },
};

const AdminSignUp = () => {
  const [signedUp, setSignedUp] = useState(false);
  const { online } = useContext(OnlineContext);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const onFinish = async ({
    firstName,
    lastName,
    userName,
    email,
    password,
  }) => {
    setConfirmLoading(true);
    const result = await Axios.post("user", {
      firstName,
      lastName,
      userName,
      email,
      password,
    });
    setConfirmLoading(false);

    if (result.data.code === 400) {
      //error
      message.error(result.data.message);
    } else {
      message.success(`Registration Successful`);
      setSignedUp(true);
    }
  };

  const onFinishFailed = () => {
    message.error(`Missing fields`);
  };
  return (
    <>
      {online ? (
        <Redirect to="/" />
      ) : (
        <>
          <div className="text-center text-muted mb-4">
            <small>Sign up</small>
          </div>
          <Form
            {...layout}
            style={{ maxWidth: "300px" }}
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              className="form-group mb-3"
              label="First Name"
              name="firstName"
              rules={[
                {
                  required: true,
                  message: "First name is required",
                },
                {
                  max: 50,
                  message: "First name should not be more than 50 characters",
                },
              ]}
            >
              <Input style={{ borderColor: "#5e72e4" }} />
            </Form.Item>
            <Form.Item
              className="form-group mb-3"
              label="Last Name"
              name="lastName"
              rules={[
                {
                  required: true,
                  message: "Last name is required",
                },
                {
                  max: 50,
                  message: "Last name should not be more than 50 characters",
                },
              ]}
            >
              <Input style={{ borderColor: "#5e72e4" }} />
            </Form.Item>
            <Form.Item
              className="form-group mb-3"
              label="Username"
              name="userName"
              rules={[
                {
                  required: true,
                  message: "Username is required",
                },
                {
                  pattern: new RegExp(/^[a-z0-9_.]{5,20}$/gim),
                  message:
                    "alphanumeric characters, numbers, underscore and dot are allowed",
                },
              ]}
            >
              <Input style={{ borderColor: "#5e72e4" }} />
            </Form.Item>
            <Form.Item
              className="form-group mb-3"
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Email is required" },
                {
                  type: "email",
                  message: "Invalid email",
                },
              ]}
            >
              <Input style={{ borderColor: "#5e72e4" }} />
            </Form.Item>

            <Form.Item
              className="form-group mb-3"
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Password is required",
                },
                {
                  pattern: new RegExp(
                    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,30}$/gm
                  ),
                  message:
                    "password should be minimum 8 and maximum 30 characters, at least one uppercase letter, one lowercase letter, one number and one special character",
                },
              ]}
            >
              <Input.Password style={{ borderColor: "#5e72e4" }} />
            </Form.Item>

            <Form.Item className="form-group mb-3" {...tailLayout}>
              <Button
                style={{
                  backgroundColor: "##5e72e4",
                  borderColor: "#5e72e4",
                  background: "#5e72e4",
                  borderRadius: "7px",
                  padding: "4px 20px",
                }}
                type="primary"
                htmlType="submit"
                loading={confirmLoading}
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
          {signedUp ? <Redirect to="/login" /> : null}
        </>
      )}
    </>
  );
};

export default AdminSignUp;
