import { Button, Popconfirm, Table } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import Axios from "../../../libs/axios";
import { DeleteTwoTone } from "@ant-design/icons";
import AddTenantFranchise from "./AddTenantFranchise";

const TenantFranchises = ({ tenantId, tenantAdmins }) => {
  const [franchises, setFranchises] = useState([]);

  const getFranchises = useCallback(async () => {
    const res = await Axios.get(`/tenant/${tenantId}/franchise`);
    setFranchises(res.data.data.franchises);
  }, [tenantId]);

  useEffect(() => {
    getFranchises();
  }, [getFranchises]);

  const columns = [
    {
      title: "Franchise ID",
      dataIndex: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Network Server",
      dataIndex: "networkServerId",
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
  ];

  const handleDelete = async (id) => {
    await Axios.delete(`/franchise/${id}`);
    getFranchises();
  };

  return (
    <>
      <span>
        <h1 className="text-white">List of franchises</h1>
        <AddTenantFranchise
          tenantAdmins={tenantAdmins}
          tenantId={tenantId}
          getFranchises={getFranchises}
        />
      </span>
      <Table
        columns={columns}
        dataSource={franchises}
        pagination={{ pageSize: 10 }}
        key="table"
        loading={1}
        style={{
          borderRadius: "15px",
          width: "100%",
          marginBottom: "5%",
        }}
      />
    </>
  );
};

export default TenantFranchises;
