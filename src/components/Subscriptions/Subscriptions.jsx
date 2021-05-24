import React, { useEffect, useState } from "react";
import Axios from "../../libs/axios";
import { Button, Popconfirm, Table, Modal } from "antd";
import { DeleteTwoTone, PlusOutlined, EditTwoTone } from "@ant-design/icons";
import EditTenantSub from "../Tenants/TenantSubscriptions/EditTenantSub";
import AddSubscription from "./AddSubscription";

const Subscriptions = () => {
  const [subs, setSubs] = useState();
  const [editModal, setEditModal] = useState(false);
  const [modalSub, setModalSub] = useState();
  const [addModal, setAddModal] = useState(false);

  const getSubs = async () => {
    const res = await Axios.get("/package");
    setSubs(res.data.data.packages);
  };

  useEffect(() => {
    getSubs();
  }, []);

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
            {/* <Button onClick={() => setEditModal(true)}> */}
            <Button onClick={() => click(record)}>
              <EditTwoTone />
            </Button>
            {editModal ? (
              <Modal
                title={`${modalSub.tenantId}`}
                centered
                visible={editModal}
                onCancel={() => setEditModal(false)}
                footer={[]}
              >
                <EditTenantSub
                  subscription={modalSub}
                  closeModal={setEditModal}
                  getTenantPackages={getSubs}
                />
              </Modal>
            ) : null}
          </>
        );
      },
    },
  ];

  const handleDelete = async (id) => {
    await Axios.delete(`/package/${id}`);
    getSubs();
  };
  return (
    <>
      <div className="main-content">
        <h1 className="display-2" style={{ textAlign: "center" }}>
          All Subscriptions
        </h1>
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
                      <div className="col-8">
                        <h3 className="mb-0">Subscriptions</h3>
                      </div>
                      <div className="col-4 text-right">
                        <button
                          className="btn btn-sm btn-primary"
                          type="button"
                          onClick={() => setAddModal(true)}
                        >
                          {`Add Subscription `}
                          <PlusOutlined />
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
                            getSubscriptions={getSubs}
                          />
                        </Modal>
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    <Table
                      columns={columns}
                      dataSource={subs}
                      pagination={{ pageSize: 10 }}
                      key="table"
                      scroll={{ y: 500 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Subscriptions;
