import instance from "../../utils/Axios";

// get transaction data by user
export const getTransactions = async () => {
  const response = await instance.get(`/admin/transaction/transactions`);
  return response.data;
};

// get transaction data by Seller
export const getTransactionsBySeller = async () => {
  const response = await instance.get(`/admin/transaction/sellertransactions`);
  return response.data;
};
