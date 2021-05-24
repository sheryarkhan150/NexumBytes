import React, { useContext, useState } from "react";
import { Redirect } from "react-router-dom";
import { Form, Input, Button, message } from "antd";
import Axios from "../../libs/axios";
import OnlineContext from "../../context/online.context";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 8 },
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
        <div>
          <h1 className="heading">Sign Up</h1>
          <Form
            {...layout}
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
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
              <Input />
            </Form.Item>
            <Form.Item
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
              <Input />
            </Form.Item>
            <Form.Item
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
                { required: true, message: "Email is required" },
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
              <Input.Password />
            </Form.Item>

            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit" loading={confirmLoading}>
                Submit
              </Button>
            </Form.Item>
          </Form>
          {signedUp ? <Redirect to="/login" /> : null}
        </div>
      )}
    </>
  );
};

export default AdminSignUp;
