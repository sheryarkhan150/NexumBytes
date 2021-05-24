import React, { useState } from "react";
import { Button, Form, Input, notification } from "antd";
import Axios from "../../libs/axios";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 10 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 8 },
};

const AddSubscription = ({ setAddModal, getSubscriptions }) => {
  const [loading, setLoading] = useState(false);

  const addSub = async ({
    packageName,
    profileName,
    billingType,
    charges,
    duration,
    durationType,
    dataQuotaVolume,
    dataQuotaVolumeType,
    tenantId,
  }) => {
    setLoading(true);
    const res = await Axios.post("/package", {
      packageName,
      profileName,
      billingType,
      charges,
      duration,
      durationType,
      dataQuotaVolume,
      dataQuotaVolumeType,
      tenantId,
    });

    if (res.data.data.code === 201) {
      getSubscriptions();
      setLoading(false);
      setAddModal(false);
    } else {
      notification.error({
        message: res.data.data.message,
        placement: "topRight",
      });
    }
  };

  const onFinishFailed = () => {
    notification.error({ message: `Missing fields`, placement: "bottomRight" });
  };

  return (
    <Form
      {...layout}
      name="basic"
      initialValues={{ remember: false }}
      onFinish={addSub}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        label="Package name"
        key="packageName"
        name="packageName"
        rules={[
          {
            required: true,
            message: "Package name is required",
          },
        ]}
      >
        <div className="form-group focused">
          <Input />
        </div>
      </Form.Item>
      <Form.Item
        label="Profile name"
        key="profileName"
        name="profileName"
        rules={[
          {
            required: true,
            message: "Profile name is required",
          },
        ]}
      >
        <div className="form-group focused">
          <Input />
        </div>
      </Form.Item>
      <Form.Item
        label="Billing type"
        key="billingType"
        name="billingType"
        rules={[
          {
            required: true,
            message: "Billing type is required",
          },
        ]}
      >
        <div className="form-group focused">
          <Input />
        </div>
      </Form.Item>
      <Form.Item
        label="Charges"
        key="charges"
        name="charges"
        rules={[
          {
            required: true,
            message: "Charges is required",
          },
          {
            pattern: new RegExp(/^[0-9]*$/),
            message: "Only numbers allowed",
          },
        ]}
      >
        <div className="form-group focused">
          <Input />
        </div>
      </Form.Item>
      <Form.Item
        label="Duration"
        key="duration"
        name="duration"
        rules={[
          {
            required: true,
            message: "Duration is required",
          },
          {
            pattern: new RegExp(/^[0-9]*$/),
            message: "Only numbers allowed",
          },
        ]}
      >
        <div className="form-group focused">
          <Input />
        </div>
      </Form.Item>
      <Form.Item
        label="Duration type"
        key="durationType"
        name="durationType"
        rules={[
          {
            required: true,
            message: "Duration type is required",
          },
        ]}
      >
        <div className="form-group focused">
          <Input />
        </div>
      </Form.Item>
      <Form.Item
        label="Data quota volume"
        key="dataQuotaVolume"
        name="dataQuotaVolume"
        rules={[
          {
            required: true,
            message: "Data quota volume is required",
          },
          {
            pattern: new RegExp(/^[0-9]*$/),
            message: "Only numbers allowed",
          },
        ]}
      >
        <div className="form-group focused">
          <Input />
        </div>
      </Form.Item>
      <Form.Item
        label="Data quota volume type"
        key="dataQuotaVolumeType"
        name="dataQuotaVolumeType"
        rules={[
          {
            required: true,
            message: "Data quota volume type is required",
          },
        ]}
      >
        <div className="form-group focused">
          <Input />
        </div>
      </Form.Item>
      <Form.Item
        label="Tenant ID"
        key="tenantId"
        name="tenantId"
        rules={[
          {
            required: true,
            message: "Tenant ID is required",
          },
          {
            pattern: new RegExp(/^[0-9]*$/),
            message: "Only numbers allowed",
          },
        ]}
      >
        <div className="form-group focused">
          <Input />
        </div>
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit" loading={loading}>
          Add Subscription
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddSubscription;
