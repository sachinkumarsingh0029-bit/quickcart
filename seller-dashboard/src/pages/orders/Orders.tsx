import React, { useEffect, useState } from "react";
import { getOrders } from "../../api/order";
import { useNavigate } from "react-router-dom";

export default function OrdersTable() {
  const [orders, setOrders] = useState<any>([]);
  const navigate = useNavigate();
  const fetchData = async () => {
    try {
      const results = await getOrders();
      console.log(results);
      setOrders(results.orders);
    } catch (error) {}
  };
  useEffect(() => {
    fetchData();
  }, []);

  const [sortColumn, setSortColumn] = useState<any>("");
  const [sortDirection, setSortDirection] = useState<any>("");

  const handleSort = (columnName: any, sortDir: any) => {
    const sortedData = orders.sort((a: any, b: any) => {
      if (sortDir === "asc") {
        return a[columnName] - b[columnName];
      } else {
        return b[columnName] - a[columnName];
      }
    });
    setSortColumn(columnName);
    setSortDirection(sortDir);
  };

  return orders !== undefined ? (
    <div className="flex flex-col justify-center p-10">
      <div className="overflow-x-auto">
        <div className="flex justify-between py-3 pl-2">
          {/* <div className="relative max-w-xs">
            <label htmlFor="hs-table-search" className="sr-only">
              Search
            </label>
            <input
              type="text"
              name="hs-table-search"
              id="hs-table-search"
              className="block w-full p-3 pl-10 text-sm border-gray-200 rounded-md focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
              placeholder="Search..."
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <svg
                className="h-3.5 w-3.5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
              </svg>
            </div>
          </div> */}

          {/* <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="flex items-center py-3 pl-3 border border-black dark:border-white rounded-md">
                <label className="text-sm font-medium text-gray-800 dark:text-white whitespace-nowrap">
                  Sort by Status:
                </label>
                <select className="block w-full my-0 pl-0 ml-1 text-sm text-gray-600 dark:text-gray-100 dark:bg-gray-900 outline-none mr-2">
                  <option>All</option>
                  <option>Price</option>
                  <option>Low to high</option>
                  <option>High to low</option>
                </select>
              </div>
            </div>
          </div> */}
        </div>

        <div className="p-1.5 w-full inline-block align-middle">
          <div className="overflow-hidden border rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                  >
                    order Id
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                  >
                    Shipping Address
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                  >
                    Order Date
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
                {orders &&
                  orders.map((order: any) => (
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                        {order._id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                        {order.fullname}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800 whitespace-wrap flex flex-wrap wrapper">
                        {order.shippingAddress}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                        {order.orderStatus}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                        {order.orderTotal}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          onClick={() => navigate(`/order/${order.orderId}`)}
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
