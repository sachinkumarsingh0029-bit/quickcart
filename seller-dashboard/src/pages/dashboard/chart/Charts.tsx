import React, { useEffect, useState } from "react";
import { getMetrics } from "../../../api/dashboard";
import TopSellingProducts from "./Sales/TopSellingProducts";
import DateRangePicker from "../../../component/datetimepicker/DateRangePicker";

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
    } catch {}
  };

  useEffect(() => {
    getData();
  }, []);

  const data = [
    {
      title: "Total Revenue",
      value: "₹" + metrics?.orderTotal || 0,
      icon: "fas fa-chart-line",
    },
    {
      title: "New Customers",
      value: metrics?.newCustomers || 0,
      icon: "fas fa-users",
    },
    {
      title: "Total Orders",
      value: metrics?.totalOrders || 0,
      icon: "fas fa-shopping-cart",
    },
    {
      title: "Conversion Rate",
      value: metrics?.conversionRate || 0 + "%",
      icon: "fas fa-chart-pie",
    },
    {
      title: "Average Order Value",
      value: "₹" + metrics?.avgOrderValue || 0,
      icon: "fas fa-dollar-sign",
    },
    {
      title: "Average Order Size",
      value: metrics?.avgOrderSize || 0,
      icon: "fas fa-file-invoice-dollar",
    },
    {
      title: "Customer Retention Rate",
      value: metrics?.retentionRate || 0 + "%",
      icon: "fas fa-user-check",
    },
    {
      title: "All Time Views",
      value: metrics?.totalViews || 0,
      icon: "fas fa-solid fa-eye",
    },
  ];

  const handleChange = async (values: any) => {
    try {
      setValue(values);
      console.log(values)
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
          {data.map((item) => (
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
