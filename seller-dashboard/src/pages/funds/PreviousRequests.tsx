import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAmount, getWithdrawalRequests } from "../../api/payroll";

const PreviousRequests = () => {
  const [accountBalance, setaccountBalance] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);
  const [withdrawalRequests, setWithdrawalRequests] = useState([]);

  const navigate = useNavigate();
  const fetchData = async () => {
    const result = await getAmount();
    const requests = await getWithdrawalRequests();
    setWithdrawalRequests(requests);
    setaccountBalance(result.amount);
    setWalletBalance(result.availableAmount)
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Use appropriate background and text colors based on the status
  const statusClasses = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  return (
    <div className="mt-10">
      <div className="rounded-lg shadow-lg p-4 bg-white bg-opacity-70 m-6">
        <div className="flex items-center justify-between mb-2">
          <div className="text-lg font-bold text-gray-800">
            Total Sales Revenue
          </div>
          <div className="text-2xl text-gray-800">
            <i className="fas fa-chart-line"></i>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-4xl font-bold text-gray-800">
            ₹{accountBalance || 0}
            <div className="text-base text-gray-800">
              Wallet Balance: ₹{walletBalance || 0}
            </div>
          </div>
          <button
            onClick={() => navigate("/request-withdrawal")}
            className="rounded-md bg-yellow-600 px-3.5 py-1.5 text-base font-semibold leading-7 text-white hover:bg-yellow-500"
            disabled={accountBalance === 0}
          >
            Request Withdrawal
          </button>
        </div>
      </div>
      <div className="flex flex-col m-6">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                    >
                      Id
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                    >
                      Account Number
                    </th>

                    <th
                      scope="col"
                      className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                    >
                      Amount
                    </th>

                    <th
                      scope="col"
                      className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                    >
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                  {withdrawalRequests.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-4">
                        No record found
                      </td>
                    </tr>
                  ) : (
                    <>
                      {withdrawalRequests?.map((request: any) => (
                        <tr key={request._id}>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {request._id}
                          </td>

                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {request.bankDetails.accountNumber}
                          </td>

                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            ₹{request.amount}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span
                              className={
                                request.status === "approved"
                                  ? "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
                                  : request.status === "rejected"
                                  ? "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800"
                                  : "px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800"
                              }
                            >
                              {request.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {new Date(request.createdAt).toLocaleDateString(
                              "en-US",
                              { month: "long", day: "numeric", year: "numeric" }
                            )}
                          </td>
                        </tr>
                      ))}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviousRequests;
