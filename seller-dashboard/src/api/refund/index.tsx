import instance from "../../utils/Axios";

// get refund data
export const getRefundData = async () => {
  const response = await instance.get("/seller/get-refund-data");
  return response.data;
};

// get refund by id
export const getRefundById = async (id: any) => {
  const response = await instance.get(`/seller/get-refund-data/id/${id}`);
  return response.data;
};

// update refund status
export const updateRefundStatus = async (id: any, status: any) => {
  const response = await instance.put(`/seller/update-refund-status/${id}`, {
    status,
  });
  return response.data;
};
