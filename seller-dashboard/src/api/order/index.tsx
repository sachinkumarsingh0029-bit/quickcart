import instance from "../../utils/Axios";

export const getOrders = async () => {
  const result = await instance.get("/seller/get-orders");
  return result.data;
};

export const getOrderById = async (orderId: any) => {
  const result = await instance.get(`/seller/get-order/${orderId}`);
  return result.data;
};

export const updateOrderStatus = async (data: any) => {
  const result = await instance.put(`/seller/update-order-status`, data);
  return result.data;
};

export const cancelOrder = async (data: any) => {
  const result = await instance.put(`/seller/cancel-order`, data);
  return result.data;
};

// add tracking details
export const addTrackingDetails = async (data: any) => {
  const result = await instance.put(`/seller/add-tracking-details`, data);
  return result.data;
}

// accept order
export const acceptOrder = async (data: any) => {
  const result = await instance.put(`/seller/accept-order`, data);
  return result.data;
}
