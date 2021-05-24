import React, { useContext } from "react";
import "./adminhomepage.css";
import { Redirect } from "react-router-dom";
import OnlineContext from "../../context/online.context";
import UserList from "../Users/UserList";
import { Bar, Line } from "react-chartjs-2";

import data from "../../variables/datasets";
import { Card } from "antd";

const AdminHomePage = () => {
  const { online } = useContext(OnlineContext);

  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };

  return (
    <>
      {online ? (
        <div className="adminHomePageDiv">
          <h1 className="heading">
            <p>Admin Home Page</p>
          </h1>
          <div className="chart-container">
            <div className="charts">
              <Card
                hoverable={1}
                title="Profit - Expense"
                style={{ borderRadius: "15px", cursor: "auto" }}
              >
                <Bar
                  data={data("bar")}
                  options={options}
                  getDatasetAtEvent={(e) => console.log(e)}
                />
              </Card>
            </div>
            <div className="charts">
              <Card
                hoverable={1}
                title="Area Coverage"
                style={{ borderRadius: "15px", cursor: "auto" }}
              >
                <Line
                  data={data("line")}
                  options={options}
                  getDatasetAtEvent={(e) => console.log(e)}
                />
              </Card>
            </div>
          </div>
          <UserList />
        </div>
      ) : (
        <Redirect to="/login" />
      )}
    </>
  );
};

export default AdminHomePage;
