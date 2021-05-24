import React, { useCallback, useEffect, useState } from "react";
import Axios from "../../../libs/axios";
import { Button, Popconfirm, Table, Modal } from "antd";
import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
import { Link, useParams } from "react-router-dom";
import "./sublist.css";
import EditTenantSub from "./EditTenantSub";
import AddSubscription from "../../Subscriptions/AddSubscription";

const TenantSubscriptions = () => {
  const { tenantId } = useParams();
  const [tenant, setTenant] = useState();
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [modalSub, setModalSub] = useState();
  const [addModal, setAddModal] = useState(false);

  const getTenantPackages = useCallback(async () => {
    const result = await Axios.get(`/tenant/${tenantId}/package`);
    setSubscriptionPlans(result.data.data.packages);
    setTenant(result.data.data.tenant);
  }, [tenantId]);

  useEffect(() => {
    getTenantPackages();
  }, [getTenantPackages]);

  const handleDelete = async (id) => {
    await Axios.delete(`/package/${id}`);
    getTenantPackages();
  };

  const columns = [
    {
      title: "Package",
      dataIndex: "packageName",
    },
    {
      title: "Profile",
      dataIndex: "profileName",
    },
    {
      title: "Billing Type",
      dataIndex: "billingType",
    },
    {
      title: "Charges",
      dataIndex: "charges",
    },
    {
      title: "Duration",
      dataIndex: "duration",
    },
    {
      title: "Duration Type",
      dataIndex: "durationType",
    },
    {
      title: "Data Qouta",
      dataIndex: "dataQuotaVolume",
    },
    {
      title: "Qouta Type",
      dataIndex: "dataQuotaVolumeType",
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
      render: (_, record) => {
        const click = (e) => {
          setModalSub(e);
          setEditModal(true);
        };
        return (
          <>
            <Button onClick={() => click(record)}>
              <EditTwoTone />
            </Button>
            {editModal ? (
              <Modal
                title={`${modalSub.profileName}`}
                centered
                visible={editModal}
                onCancel={() => setEditModal(false)}
                footer={[]}
              >
                <EditTenantSub
                  subscription={modalSub}
                  closeModal={setEditModal}
                  getTenantPackages={getTenantPackages}
                />
              </Modal>
            ) : null}
          </>
        );
      },
    },
  ];
  return (
    <div className="main-content">
      <Link to={`/tenant/${tenantId}`}>
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
      <div
        className="header pb-8 pt-5 pt-lg-8 align-items-center"
        style={{
          minHeight: "800px",
          backgroundSize: "cover",
          backgroundPosition: "center-top",
          textAlign: "center",
        }}
      >
        <span className="mask bg-gradient-default opacity-8">
          {tenant ? (
            <h1 className="text-white">
              Subscription plans for: {tenant.companyName}
            </h1>
          ) : (
            <h1 className="text-white">Subscription plans for:</h1>
          )}
        </span>
        <div>
          <Table
            className="subcription-table"
            columns={columns}
            dataSource={subscriptionPlans}
            pagination={{ pageSize: 10 }}
            rowKey={(data) => data.id}
            scroll={{ y: 500 }}
            style={{ width: "85%", margin: "auto" }}
          />
        </div>
        <button
          className="btn btn-primary my-4"
          type="button"
          onClick={() => setAddModal(true)}
        >
          Add Subscription
        </button>
        <Modal
          title="Add Subscription"
          centered
          visible={addModal}
          onCancel={() => setAddModal(false)}
          footer={[]}
          // okButtonProps={{ disabled: disableOk }}
        >
          <AddSubscription
            setAddModal={setAddModal}
            getSubscriptions={getTenantPackages}
          />
        </Modal>
        <div className="container-fluid d-flex align-items-center"></div>
      </div>
    </div>
  );
};

export default TenantSubscriptions;
