import instance from "../../utils/Axios";

// get payrolls data
export const getWithdrawalRequests = async () => {
  const response = await instance.get(
    `/admin/payroll/payrolls/withdrawalrequests`
  );
  return response.data;
};

// transfer amount
export const transferAmount = async (id: any) => {
  const response = await instance.post(
    `/admin/payroll/payrolltransfer/withdrawalrequest/accept/${id}`
  );
  return response.data;
};
