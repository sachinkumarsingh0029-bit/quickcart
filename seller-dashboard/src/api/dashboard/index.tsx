import instance from "../../utils/Axios";

export const getMetrics = async (data: any) => {
  console.log(data);
  const result = await instance.get(
    `/seller/get-metrics?from=${data.start ? data.start : ""}&to=${
      data.end ? data.end : ""
    }`
  );
  return result.data;
};

export const getSalesMetricsData = async () => {
  const result = await instance.get("/seller/get-sales-data");
  return result.data;
};
