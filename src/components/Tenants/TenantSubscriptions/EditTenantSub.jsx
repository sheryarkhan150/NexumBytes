import { Button, Form, Input, notification } from "antd";
import React, { useState } from "react";
import Axios from "../../../libs/axios";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 10 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 8 },
};

const EditTenantSub = ({ subscription, closeModal, getTenantPackages }) => {
  const [loading, setLoading] = useState(false);
  const {
    packageName,
    profileName,
    billingType,
    charges,
    duration,
    durationType,
    dataQuotaVolume,
    dataQuotaVolumeType,
    tenantId,
    id,
  } = subscription;
  const initialValues = {
    packageName,
    profileName,
    billingType,
    charges,
    duration,
    durationType,
    dataQuotaVolume,
    dataQuotaVolumeType,
    tenantId,
  };

  const editSubscription = async ({
    packageName,
    profileName,
    billingType,
    charges,
    duration,
    durationType,
    dataQuotaVolume,
    dataQuotaVolumeType,
  }) => {
    setLoading(true);
    await Axios.put(`/package/${id}`, {
      packageName,
      profileName,
      billingType,
      charges,
      duration,
      durationType,
      dataQuotaVolume,
      dataQuotaVolumeType,
    });
    getTenantPackages();
    setLoading(false);
    closeModal(false);
  };

  const onFinishFailed = () => {
    notification.error({ message: `Missing fields`, placement: "bottomRight" });
  };

  return (
    <div>
      <Form
        {...layout}
        name="basic"
        // form={subForm}
        initialValues={initialValues}
        onFinish={editSubscription}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Package Name"
          key="packageName"
          name="packageName"
          rules={[
            {
              required: true,
              message: "Package name is required",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Profile Name"
          key="profileName"
          name="profileName"
          rules={[
            {
              required: true,
              message: "Profile name is required",
            },
          ]}
        >
          <Input />
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
          <Input />
        </Form.Item>
        <Form.Item
          label="Charges"
          key="charges"
          name="charges"
          rules={[
            {
              required: true,
              message: "Charges field is required",
            },
          ]}
        >
          <Input />
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
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Duration Type"
          key="durationType"
          name="durationType"
          rules={[
            {
              required: true,
              message: "Duration type is required",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Data Qouta"
          key="dataQuotaVolume"
          name="dataQuotaVolume"
          rules={[
            {
              required: true,
              message: "Data qouta is required",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Data Qouta Type"
          key="dataQuotaVolumeType"
          name="dataQuotaVolumeType"
          rules={[
            {
              required: true,
              message: "Data qouta type is required",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Update Subscription
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditTenantSub;
