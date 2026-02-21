import instance from "../../utils/Axios";

interface TransactionData {
  type: string;
  amount: number;
  paymentMethod: string;
}

export const createTransaction = async (data: TransactionData) => {
  const response = await instance.post(`payment/transaction`, data);
  return response.data;
};

export const updateTransaction = async (transactionId: any) => {
  console.log(transactionId);
  const response = await instance.put(`payment/transaction/${transactionId}`, {
    status: "Completed",
  });
  return response.data;
};

export const getTransactionsApi = async () => {
  const response = await instance.get(`payment/transactions`);
  return response.data;
};

export const placeOrderApi = async (data: any) => {
  try {
    const response = await instance.post("order/placeorder", data);
    return response.data;
  } catch (error) {
    return { success: false, message: "Network error" };
  }
};

export const getOrderApi = async () => {
  try {
    const response = await instance.get("order/all-orders");
    return response.data;
  } catch (error) {
    return { success: false, message: "Network error" };
  }
};

// get review rating did by user
export const getReviewRating = async (id: string) => {
  const response = await instance.get(`order/rating/${id}`);
  return response.data;
};

// save review and rating
export const createReviewRating = async (id: any, data: any) => {
  const response = await instance.post(`order/rating/${id}/give`, data);
  return response.data;
};

// order refund request
export const orderRefundRequest = async (data: any) => {
  const response = await instance.post(`order/refund/`, data);
  return response.data;
};
