import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Popconfirm,
  Form,
  Input,
  Modal,
  notification,
} from "antd";
import { DeleteTwoTone, PlusOutlined, EditTwoTone } from "@ant-design/icons";
import axios from "../../libs/axios";
import { Link } from "react-router-dom";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 8 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 8 },
};

const UserList = () => {
  const [userForm] = Form.useForm();
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const fetchData = async () => {
    const result = await axios.get("/user");
    setData(result.data.data.users);
  };

  useEffect(() => {
    fetchData();
  }, []);
  const columns = [
    {
      title: "ID",
      key: "id",
      dataIndex: "id",
    },
    {
      title: "Username",
      key: "username",
      dataIndex: "userName",
      render: (text, record) => <Link to={`/user/${record.id}`}>{text}</Link>,
    },
    {
      title: "First Name",
      key: "fn",
      dataIndex: "firstName",
    },
    {
      title: "Last Name",
      key: "ln",
      dataIndex: "lastName",
    },
    {
      title: "Email",
      key: "email",
      dataIndex: "email",
      // render: (text) => <a>{text}</a>,
    },
    {
      title: "Delete",
      key: "del",
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
      key: "edit",
      render: (_, record) => (
        <Button>
          <EditTwoTone />
        </Button>
      ),
    },
  ];
  const handleDelete = async (id) => {
    await axios.delete(`/user/${id}`);
    fetchData();
  };

  const addUser = async ({
    firstName,
    lastName,
    userName,
    email,
    password,
  }) => {
    setConfirmLoading(true);
    const result = await axios.post("user", {
      firstName,
      lastName,
      userName,
      email,
      password,
    });
    setConfirmLoading(false);

    if (result.data.code === 400) {
      notification.error({
        message: result.data.message,
        placement: "bottomRight",
      });
    } else {
      notification.success({
        message: `Registration Successful`,
        placement: "bottomRight",
      });
      fetchData();
      userForm.resetFields();
    }
  };

  const onFinishFailed = () => {
    notification.error({ message: `Missing fields`, placement: "bottomRight" });
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const showModal = () => {
    setVisible(true);
  };

  return (
    <div>
      <Modal
        title="Add User"
        centered
        visible={visible}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        footer={[]}
        // okButtonProps={{ disabled: disableOk }}
      >
        {
          <div>
            <Form
              {...layout}
              name="basic"
              initialValues={{ remember: false }}
              form={userForm}
              onFinish={addUser}
              onFinishFailed={onFinishFailed}
            >
              <Form.Item
                label="First Name"
                key="firstName"
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
                key="lastname"
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
                key="username"
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
                key="email"
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
                key="password"
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
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={confirmLoading}
                >
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </div>
        }
      </Modal>
      <span className="div-header">
        <h2>Users List</h2>
        <Button
          className="div-header-button"
          type="primary"
          shape="round"
          onClick={() => showModal()}
        >
          Add User
          <PlusOutlined />
        </Button>
      </span>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 10 }}
        rowKey={(data) => data.id}
        scroll={{ y: 500 }}
      />
    </div>
  );
};

export default UserList;
