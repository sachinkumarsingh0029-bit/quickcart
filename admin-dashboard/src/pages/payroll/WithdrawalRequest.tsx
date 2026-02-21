import React, { useEffect, useState } from "react";
import { getUsers } from "../../api/user";
import { useNavigate } from "react-router-dom";
import { getSellers } from "../../api/seller";
import { getWithdrawalRequests } from "../../api/payroll";
import BankDetails from "./BankDetails";

const WithdrawalRequest = () => {
  // users state
  const [requests, setRequests] = React.useState<any>([]);
  // fetch function to get user data using getUsers
  const fetchData = async () => {
    const response = await getWithdrawalRequests();
    console.log(response);
    setRequests(response.requests);
  };

  const [bankDetailsModal, setBankDetailsModal] = useState(false);

  const [currentId, setCurrentId] = useState<any>("");

  const handleBankDetailsModel = async (id: any) => {
    try {
      setCurrentId(id);
      setBankDetailsModal(true);
    } catch (error) {}
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <section className="mx-auto">
        <div className="flex flex-col">
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
                        Business Username
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                      >
                        status
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                      >
                        amount
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                      >
                        Requested on
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                      >
                        email
                      </th>

                      <th scope="col" className="relative py-3.5 px-4">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                    {requests.map((request: any, index: any) => (
                      <tr>
                        <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                          {request?._id}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                          {request?.seller.businessUsername}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                          {request?.status}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                          {request?.amount}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                          {new Date(request?.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                              hour: "numeric",
                              minute: "numeric",
                            }
                          )}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                          <a
                            className="text-blue-500 transition-colors duration-200 hover:text-indigo-500 focus:outline-none"
                            href={`mailto:${request?.seller.businessEmail}`}
                          >
                            Send
                          </a>
                          <br />
                          {request?.seller.businessEmail}
                        </td>
                        <td className="px-4 py-4 text-sm whitespace-nowrap">
                          <div className="flex items-center gap-x-6">
                            <button
                              onClick={() =>
                                handleBankDetailsModel(request._id)
                              }
                              className="text-blue-500 transition-colors duration-200 hover:text-indigo-500 focus:outline-none"
                            >
                              Bank Details
                            </button>
                          </div>
                        </td>

                        <BankDetails
                          isOpen={bankDetailsModal}
                          closeModal={() => setBankDetailsModal(false)}
                          bankDetails={request?.bankDetails}
                          requestId={currentId}
                          fetchData={fetchData}
                        />
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WithdrawalRequest;
