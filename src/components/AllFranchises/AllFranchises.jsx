import { Table } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import Axios from "../../libs/axios";

const AllFranchises = () => {
  const [franchises, setFranchises] = useState([]);

  const getFranchises = useCallback(async () => {
    const res = await Axios.get(`/franchise`);
    setFranchises(res.data.data.franchises);
  }, []);

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
  ];

  return (
    <>
      <div className="main-content">
        <h1 className="display-2" style={{ textAlign: "center" }}>
          All Franchises
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
                        <h3 className="mb-0">Franchises</h3>
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    <Table
                      columns={columns}
                      dataSource={franchises}
                      pagination={{ pageSize: 10 }}
                      rowKey={(data) => data.id}
                      scroll={{ y: 500 }}
                      loading={1}
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

export default AllFranchises;
