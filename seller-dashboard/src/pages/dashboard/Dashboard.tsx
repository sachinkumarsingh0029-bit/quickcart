import React from "react";
import DashboardCharts from "./chart/Charts";
import SalesChart from "./chart/Sales/SalesChart";

const Dashboard = () => {
  return (
    <div className="p-5">
      <DashboardCharts />
      <SalesChart />
    </div>
  );
};

export default Dashboard;
