import React, { useContext, useState } from "react";
import { Redirect } from "react-router-dom";
import { Form, Input, Button, Typography, message, notification } from "antd";
import Axios from "../../libs/axios";
import OnlineContext from "../../context/online.context";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 8 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 8 },
};

const AdminLogin = ({ setToken }) => {
  const [userFound, setUserFound] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { online } = useContext(OnlineContext);

  const onFinish = async ({ email, password }) => {
    try {
      setConfirmLoading(true);
      const result = await Axios.post("auth/login", {
        email,
        password,
      });
      const token = result.data.data.tokens.access.token;
      const user = result.data.data.user;
      if (token && user) {
        setConfirmLoading(false);
        message.success(`Welcome back ${user.firstName} ${user.lastName}!`);
        localStorage.setItem("user", user.userName);
        localStorage.setItem("id", user.id);
        localStorage.setItem("name", `${user.firstName} ${user.lastName}`);
        setToken(token);
        setUserFound(true);
      }
    } catch (error) {
      message.error("Invalid username or password");
      setShowReset(true);
      setConfirmLoading(false);
    }
  };

  const onFinishFailed = () => {
    notification.error({
      message: "invalid username or password",
      placement: "topRight",
    });
    setUserFound(false);
  };
  return (
    <div>
      {!online ? (
        <>
          <h1 className="heading">Sign in</h1>
          <Form
            {...layout}
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Invalid email",
                  type: "email",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password" },
              ]}
            >
              <Input.Password />
            </Form.Item>
            {showReset ? (
              <>
                <Typography.Text type="danger">
                  invalid email or password
                  <Typography.Link
                    style={{ cursor: "pointer", margin: "0 5px" }}
                  >
                    click here
                  </Typography.Link>
                  to reset password
                </Typography.Text>
              </>
            ) : null}

            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit" loading={confirmLoading}>
                Submit
              </Button>
            </Form.Item>
          </Form>
          {userFound ? <Redirect to="/" /> : null}
        </>
      ) : (
        <Redirect to="/" />
      )}
    </div>
  );
};

export default AdminLogin;
