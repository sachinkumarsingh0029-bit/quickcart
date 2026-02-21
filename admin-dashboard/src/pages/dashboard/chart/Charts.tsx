import React, { useEffect, useState } from "react";
// import { getMetrics } from "../../../api/dashboard";
import TopSellingProducts from "./TopSellingProducts";
import DateRangePicker from "../datetimepicker/DateRangePicker";
import { getMetrics } from "../../../api/dashboard";

const initialState = {
  orderTotal: 0,
  newCustomers: 0,
  totalOrders: 0,
  conversionRate: 0,
  avgOrderValue: 0,
  customerLifetimeValue: 0,
  avgOrderSize: 0,
  customerRetentionRate: 0,
  retentionRate: 0,
  totalViews: 0,
  totalTickets: 0,
  totalSearches: 0,
  totalUsers: 0,
  totalSellers: 0,
};

const DashboardCharts = () => {
  const [metrics, setMetrics] = useState<any>(initialState);
  const [value, setValue] = useState({
    startDate: null,
    endDate: null,
  });

  const getData = async () => {
    try {
      const result = await getMetrics(value);
      setMetrics(result);
      console.log(result);
    } catch {}
  };

  useEffect(() => {
    getData();
  }, []);

  const websitedata = [
    {
      title: "New Users",
      value: metrics.totalUsers,
      icon: "fas fa-chart-line",
    },
    {
      title: "New Sellers",
      value: metrics.totalSellers,
      icon: "fas fa-users",
    },
    {
      title: "Total Searches",
      value: metrics.totalSearches,
      icon: "fas fa-shopping-cart",
    },
    {
      title: "Total Tickets",
      value: metrics.totalTickets,
      icon: "fas fa-chart-pie",
    },
  ];

  const salesdata = [
    {
      title: "Total Revenue",
      value: "₹" + metrics.orderTotal,
      icon: "fas fa-chart-line",
    },
    {
      title: "New Customers",
      value: metrics.newCustomers,
      icon: "fas fa-users",
    },
    {
      title: "Total Orders",
      value: metrics.totalOrders,
      icon: "fas fa-shopping-cart",
    },
    {
      title: "Conversion Rate",
      value: metrics.conversionRate + "%",
      icon: "fas fa-chart-pie",
    },
    {
      title: "Average Order Value",
      value: "₹" + metrics.avgOrderValue,
      icon: "fas fa-dollar-sign",
    },
    {
      title: "Average Order Size",
      value: metrics.avgOrderSize,
      icon: "fas fa-file-invoice-dollar",
    },
    {
      title: "Customer Retention Rate",
      value: metrics.retentionRate + "%",
      icon: "fas fa-user-check",
    },
    {
      title: "All Time Traffic",
      value: metrics.totalViews,
      icon: "fas fa-solid fa-eye",
    },
  ];

  const handleChange = async (values: any) => {
    try {
      setValue(values);
      const result = await getMetrics(values);
      setMetrics(result);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="bg-white shadow-lg rounded-lg p-6 mb-4">
        <DateRangePicker handleChange={handleChange} />
        <div className="flex flex-wrap items-center justify-center w-full mt-3">
          {websitedata.map((item) => (
            <div
              key={item.title}
              className="w-full sm:w-1/2 md:w-1/4 lg:w-1/4 px-4 mb-4"
            >
              <div className="rounded-lg shadow-lg p-4 bg-white bg-opacity-70">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-lg font-bold text-gray-800">
                    {item.title}
                  </div>
                  <div className="text-2xl text-gray-800">
                    <i className={item.icon}></i>
                  </div>
                </div>
                <div className="text-4xl font-bold text-gray-800">
                  {item.value}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-center w-full mt-3">
          {salesdata.map((item) => (
            <div
              key={item.title}
              className="w-full sm:w-1/2 md:w-1/4 lg:w-1/4 px-4 mb-4"
            >
              <div className="rounded-lg shadow-lg p-4 bg-white bg-opacity-70">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-lg font-bold text-gray-800">
                    {item.title}
                  </div>
                  <div className="text-2xl text-gray-800">
                    <i className={item.icon}></i>
                  </div>
                </div>
                <div className="text-4xl font-bold text-gray-800">
                  {item.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <TopSellingProducts products={metrics.topSellingProducts} />
    </>
  );
};

export default DashboardCharts;
