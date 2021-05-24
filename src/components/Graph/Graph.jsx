import { Bar } from "ant-design-pro/lib/Charts";
import React, { useEffect, useState } from "react";
import "./graph.css";

const Graph = () => {
  const [data, setData] = useState([]);

  console.log(new Date().getTime() + 1000 * 60 * 30);

  useEffect(() => {
    const salesData = [];
    for (let i = 0; i < 12; i++) {
      salesData.push({
        x: `${i + 1}`,
        y: Math.floor(Math.random() * 1000) + 200,
        title: "test",
      });
    }
    setData(salesData);
  }, []);
  return (
    <>
      {data ? (
        <div className="graph-content">
          <Bar
            height={300}
            data={data}
            //   titleMap={{ y1: "y1", y2: "y2" }}
            title="Profits"
          />
        </div>
      ) : null}
    </>
  );
};

export default Graph;
