const chartType = (type) => {
  const data = {
    labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
    datasets: [
      {
        type,
        label: "profit",
        data: [10, 19, 10, 19, 14, 11, 6, 9, 10, 17, 14, 10],
        fill: false,
        backgroundColor: "rgb(79, 198, 47)",
        borderColor: "rgba(79, 198, 47, 0.2)",
      },
      {
        type,
        label: "expenses",
        data: [12, 9, 11, 15, 12, 13, 5, 8, 1, 10, 8, 2],
        fill: false,
        backgroundColor: "rgb(255, 87, 51)",
        borderColor: "rgba(255, 87, 51, 0.2)",
      },
    ],
  };

  return data;
};

export default chartType;
