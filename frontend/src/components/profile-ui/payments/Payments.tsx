import React, { useEffect, useState } from "react";
import { getTransactionsApi } from "../../../api/order";

const Payments = () => {
  const [transaction, setTransaction] = useState<any>([]);
  async function getTrasactions() {
    const results = await getTransactionsApi();
    setTransaction(results.transactions);
    console.log(results.transactions);
  }
  useEffect(() => {
    getTrasactions();
  }, []);

  return transaction.length > 0 ? (
    <div className="mt-10 p-4">
      <header className="text-left">
        <h1 className="text-xl font-bold text-gray-900 sm:text-3xl">
          Previous Transactions
        </h1>
      </header>
      <div className="mt-10">
        <section className="container px-4 mx-auto">
          <div className="flex flex-col">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {/* Repeat this transaction box for each transaction */}
                  {transaction ? (
                    transaction.map((transaction: any) => (
                      <div className="bg-white shadow-md rounded-md p-4">
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center">
                            <button className="flex items-center gap-x-1">
                              <span className="text-gray-500 dark:text-gray-400 font-medium">
                                Payment
                              </span>
                            </button>
                          </div>
                          <span className="text-gray-400 text-xs pl-4">
                            {new Date(transaction.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                            ₹{transaction.amount}
                          </span>
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-medium ${
                              transaction.status === "Pending"
                                ? "bg-yellow-200 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-200"
                                : transaction.status === "Completed"
                                ? "bg-green-200 text-green-700 dark:bg-green-700 dark:text-green-200"
                                : transaction.status === "Failed"
                                ? "bg-red-200 text-red-700 dark:bg-red-700 dark:text-red-200"
                                : transaction.status === "Refunded"
                                ? "bg-blue-200 text-blue-700 dark:bg-blue-700 dark:text-blue-200"
                                : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
                            }`}
                          >
                            {transaction.status}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No Transaction Found</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  ) : (
    <div className="mt-10 p-4">
      <header className="text-left">
        <h1 className="text-xl font-bold text-gray-900 sm:text-3xl">
          No Previous Transactions
        </h1>
      </header>
    </div>
  );
};

export default Payments;
