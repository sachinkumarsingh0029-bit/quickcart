import instance from "../../utils/Axios";

// get refund requests data
export const getRefundRequests = async () => {
  const response = await instance.get(`/admin/order/refundrequests`);
  return response.data;
};

// get refund request by id
export const getRefundRequestById = async (id: any) => {
  const response = await instance.get(`/admin/order/refundrequest/${id}`);
  return response.data;
};

// approve refund
export const approveRefund = async (id: any) => {
  const response = await instance.post(`/admin/order/approve-refund/${id}`);
  return response.data;
};
