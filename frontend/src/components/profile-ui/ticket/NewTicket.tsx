import { useEffect, useState } from "react";
import axios from "axios";
import { createTicket } from "../../../api/ticket";
import { getOrderApi } from "../../../api/order";

const NewTicket = ({ isOpen, closeModal, fetchData }: any) => {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [orders, setOrders] = useState<any>([]);
  const [order, setOrder] = useState<any>("");
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    try {
      const data = {
        subject,
        description,
        order, // it should be id of order
      };
      const response = await createTicket(data);
      console.log(response);
      closeModal();
      await fetchData();
      setSubject("");
      setDescription("");
      setOrder("");
      setErrors([]);
    } catch (error: any) {
      // Handle errors
      console.log(error.response.data);
      setErrors(error.response.data.errors);
    }
  };

  async function fetchOrders() {
    try {
      const orders = await getOrderApi();
      setOrders(orders.orders);
    } catch (error) {}
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="relative flex justify-center">
      {isOpen && (
        <div
          className="fixed inset-0 z-10 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0 ">
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="relative inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl rtl:text-right dark:bg-gray-900 border-gray-800 sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6 text-black dark:text-white">
              <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="mb-4">
                  <label
                    htmlFor="subject"
                    className="block mb-2 font-bold text-gray-700"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    required
                    name="subject"
                    className="w-full p-2 border rounded-md outline-none focus:border-blue-500"
                    value={subject}
                    onChange={(event) => setSubject(event.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="description"
                    className="block mb-2 font-bold text-gray-700"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    required
                    name="description"
                    className="w-full p-2 border rounded-md outline-none focus:border-blue-500"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                  />
                </div>

                {orders && (
                  <div className="mb-4">
                    <label
                      htmlFor="order"
                      className="block mb-2 font-bold text-gray-700"
                    >
                      Order
                    </label>
                    <select
                      id="order"
                      name="order"
                      className="w-full p-2 border rounded-md outline-none focus:border-blue-500"
                      value={order}
                      required
                      onChange={(event) => setOrder(event.target.value)}
                    >
                      <option value="">Select an order</option>
                      {orders &&
                        orders?.map((order: any) => (
                          <option key={order._id} value={order._id}>
                            {order._id} -{" "}
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-US",
                              { month: "long", day: "numeric", year: "numeric" }
                            )}{" "}
                            - {order.orderStatus} - {order.orderTotal}
                          </option>
                        ))}
                    </select>
                  </div>
                )}

                {errors.length > 0 && (
                  <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-md">
                    {errors.map((error: any) => (
                      <p key={error.msg}>{error.msg}</p>
                    ))}
                  </div>
                )}

                <button
                  type="submit"
                  className="block w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Create Ticket
                </button>
              </form>

              <div className="mt-5 sm:flex sm:items-center sm:justify-end">
                <div className="sm:flex sm:items-center">
                  <button
                    onClick={closeModal}
                    className="w-full px-4 py-2 mt-2 text-sm font-medium tracking-wide text-gray-700 capitalize transition-colors duration-300 transform border border-gray-200 rounded-md sm:mt-0 sm:w-auto sm:mx-2 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800 hover:bg-gray-100 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-40 bg-red-500 text-white hover:bg-red-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
            <div className="fixed z-[-1] inset-0 bg-slate-100 opacity-40"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewTicket;
