import { Button, Input, notification, Modal, Form } from "antd";
import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import Axios from "../../../libs/axios";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 10 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 8 },
};

const AddTenantFranchise = ({ tenantAdmins, tenantId, getFranchises }) => {
  const [admin, setAdmin] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("id");

    if (tenantAdmins) {
      var result = tenantAdmins.find((obj) => {
        return Number(obj.userId) === Number(user);
      });

      if (result) setAdmin(result);
    }
  }, [tenantAdmins]);

  const addFranchise = async ({ name, networkServerId }) => {
    setLoading(true);
    await Axios.post("/franchise", {
      name,
      networkServerId,
      tenantId,
    });
    getFranchises();
    setLoading(false);
    setVisible(false);
  };

  const onFinishFailed = () => {
    notification.error({ message: `Missing Fields`, placement: "bottomRight" });
  };

  if (admin) {
    return (
      <div className="mb-5">
        <Button type="primary" shape="round" onClick={() => setVisible(true)}>
          Add Franchise
          <PlusOutlined />
        </Button>
        <Modal
          title="Add Franchise"
          centered
          visible={visible}
          confirmLoading={loading}
          onCancel={() => setVisible(false)}
          footer={[]}
        >
          <Form
            {...layout}
            name="basic"
            initialValues={{ remember: false }}
            onFinish={addFranchise}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              label="Franchise Name"
              key="name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Name is required",
                },
              ]}
            >
              <div className="form-group focused">
                <Input />
              </div>
            </Form.Item>
            <Form.Item
              label="Network Server ID"
              key="networkServer"
              name="networkServerId"
              rules={[
                {
                  required: true,
                  message: "Network Server ID is required",
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
      </div>
    );
  } else {
    return (
      <p>
        <Button type="primary" shape="round" disabled>
          Add Franchise
          <PlusOutlined />
        </Button>
      </p>
    );
  }
};

export default AddTenantFranchise;
