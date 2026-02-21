import React, { useEffect, useState } from "react";
import { getOrders } from "../../api/order";
import { useNavigate } from "react-router-dom";
import { getRefundData } from "../../api/refund";

export default function Refunds() {
  const [refunds, setRefunds] = useState<any>([]);
  const navigate = useNavigate();
  const fetchData = async () => {
    try {
      const results = await getRefundData();
      console.log(results);
      setRefunds(results.refundRequest);
    } catch (error) {}
  };
  useEffect(() => {
    fetchData();
  }, []);

  return refunds !== undefined ? (
    <div className="flex flex-col justify-center p-10">
      <div className="overflow-x-auto">
        <div className="flex justify-between py-3 pl-2"></div>

        <div className="p-1.5 w-full inline-block align-middle">
          <div className="overflow-hidden border rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                  >
                    refund Id
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                  >
                    Refund Request Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                  >
                    Total
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-bold text-right text-gray-500 uppercase "
                  >
                    View Details
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {refunds &&
                  refunds.map((refund: any) => (
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                        {refund._id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                        {new Date(refund.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                        {refund.status}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                        {refund.amount}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          onClick={() => navigate(`/refund/${refund._id}`)}
                        >
                          Show Details
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <p>No order Found</p>
  );
}
