import instance from "../../utils/Axios";

export const getAmount = async () => {
  const response = await instance.get("/payroll");
  return response.data;
};

export const requestWithdrawal = async (data: any) => {
  const response = await instance.post("/payroll", data);
  return response.data;
};

// get Withdrawal Requests
export const getWithdrawalRequests = async () => {
  const response = await instance.get("/payroll/withdrawal-requests");
  console.log(response);
  return response.data.requests;
};
