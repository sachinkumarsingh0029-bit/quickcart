import React, { useEffect, useState } from "react";
import {
  acceptOrder,
  addTrackingDetails,
  cancelOrder,
  getOrderById,
  updateOrderStatus,
} from "../../api/order";
import { useNavigate, useParams } from "react-router-dom";
import { CreateToast } from "../../utils/Toast";
import FullPageLoading from "../loading/FullPageLoading";
import { BeatLoader } from "react-spinners";

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = React.useState<any>({});
  const [showModal, setShowModal] = React.useState(false);
  const [modalTitle, setModalTitle] = React.useState<any>();
  const [newOrderStatus, setNewOrderStatus] = React.useState<any>("Shipped");
  const [cancellationReason, setCancellationReason] = useState<any>("");
  const [carrierName, setCarrierName] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    // fetch order data from API
    const result = await getOrderById(orderId);
    setOrder(result.order[0]);
    if (result.order[0].trackingDetails !== undefined) {
      setCarrierName(result.order[0].trackingDetails.carrierName);
      setTrackingNumber(result.order[0].trackingDetails.trackingNumber);
      setTrackingUrl(result.order[0].trackingDetails.trackingUrl);
      setDeliveryDate(
        result.order[0].trackingDetails.deliveryDate.substring(0, 10)
      );
      setDeliveryStatus(result.order[0].trackingDetails.deliveryStatus);
    }
    console.log(result.order[0]);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async () => {
    // update order
    try {
      const data = {
        _id: order._id,
        newStatus: newOrderStatus,
      };
      const result = await updateOrderStatus(data);
      setOrder(result.order);
      setModalTitle("Order Updated");
      CreateToast("orderupdated", "Order updated successfully", "success");
    } catch {
      CreateToast("somethingwent", "Something went wrong...", "error");
    }
    setShowModal(false);
  };

  const handleCancelOrder = async () => {
    // cancel order
    setLoading(true);
    try {
      const sanitizedReason = cancellationReason.replace(/(\r\n|\n|\r)/gm, "");
      const data = {
        _id: order._id,
        reason: sanitizedReason,
      };
      const result = await cancelOrder(data);
      if (result) {
        navigate("/orders");
        CreateToast("orderupdated", "Order Cancelled successfully", "info");
      }
    } catch {
      CreateToast("somethingwent", "Something went wrong...", "error");
    }
    setShowModal(false);
    setLoading(false);
  };

  const handleAddTrackingDetails = async () => {
    const trackingDetails = {
      _id: order._id,
      carrierName,
      trackingNumber,
      trackingUrl,
      deliveryDate,
      deliveryStatus,
    };
    try {
      const result = await addTrackingDetails(trackingDetails);
      if (result) {
        setOrder(result.order);
        setModalTitle("Tracking Details Added");
        CreateToast(
          "trackingdetails",
          "Tracking details added successfully",
          "success"
        );
      }
    } catch {
      CreateToast("somethingwent", "Something went wrong...", "error");
    }
    setShowModal(false);
  };

  // accept order
  const handleAcceptOrder = async () => {
    try {
      const data = {
        _id: order._id,
      };
      const result = await acceptOrder(data);
      setOrder(result.order);
      setModalTitle("Order Accepted");
      CreateToast("orderupdated", "Order accepted successfully", "success");
    } catch {
      CreateToast("somethingwent", "Something went wrong...", "error");
    }
    setShowModal(false);
  };

  return order ? (
    <div className="bg-white shadow rounded-md p-6 mt-10">
      <div className="flex justify-between mb-6">
        <h2 className="text-lg font-bold">Order #{order._id}</h2>
        <p className="text-gray-500">{order.date}</p>
      </div>
      <hr className="border-gray-300 mb-6" />
      <div className="mb-6">
        <h3 className="text-sm font-bold mb-2">Shipping Address</h3>
        <p>{order.fullname}</p>
        <p>{order.number}</p>
        <p>{order.shippingAddress}</p>
      </div>
      <div className="mb-6">
        <h3 className="text-sm font-bold mb-2">Order Details</h3>
        {order?.products?.map((item: any) => (
          <div key={item._id} className="flex items-center space-x-3">
            <div className="flex-shrink-0 h-10 w-10">
              <img
                className="h-10 w-10 rounded-full mr-3"
                src={item.product.thumbnailUrl}
                alt={item.product.productName}
              />
            </div>
            <div className="flex-1">
              <p className="font-bold">{item.product.productName}</p>
              <p className="text-gray-900">
                <span className="font-medium">{item.quantity} Unit </span>
                <span className="font-medium text-red-500">x</span>
                <span className="font-medium ml-1">
                  ₹{item.discountedPrice}
                </span>
              </p>
            </div>
          </div>
        ))}
        <div className="mt-10">
          <div className="flex justify-between font-bold mb-2">
            <div className="text-gray-900">Amount</div>
            <div className="text-gray-900">₹{order.orderAmount}</div>
          </div>
          <div className="flex justify-between font-bold mb-2">
            <div className="text-gray-900">Discount</div>
            <div className="text-gray-900">- ₹{order.totalDiscount}</div>
          </div>
          <div className="flex justify-between font-bold mb-2">
            <div className="text-gray-900">Total</div>
            <div className="text-green-500">₹{order.orderTotal}</div>
          </div>
        </div>
      </div>
      {order.orderStatus !== "Cancelled" && (
        <div className="mt-6 flex justify-end space-x-3">
          {order.orderStatus !== "Completed" && (
            <>
              {order.orderStatus !== "Delivered" && (
                <>
                  {order.orderStatus !== "Placed" ? (
                    <>
                      {order.orderStatus === "Placed" ||
                        order.orderStatus === "Confirmed" ||
                        (order.orderStatus === "Shipped" && (
                          <button
                            className="rounded-md bg-yellow-600 px-3.5 py-1.5 text-base font-semibold leading-7 text-white hover:bg-yellow-500"
                            onClick={() => (
                              setShowModal(true),
                              setModalTitle("Add Tracking Details")
                            )}
                          >
                            {order.trackingDetails !== undefined
                              ? "Update Tracking Details"
                              : "Add Tracking Details"}
                          </button>
                        ))}
                      <button
                        className="rounded-md bg-green-600 px-3.5 py-1.5 text-base font-semibold leading-7 text-white hover:bg-green-500"
                        onClick={() => (
                          setShowModal(true),
                          setModalTitle("Update Order Status")
                        )}
                      >
                        Update Order Status
                      </button>
                    </>
                  ) : (
                    <button
                      className="rounded-md bg-green-600 px-3.5 py-1.5 text-base font-semibold leading-7 text-white hover:bg-green-500"
                      onClick={handleAcceptOrder}
                    >
                      Accept Order
                    </button>
                  )}
                </>
              )}
            </>
          )}
          {order.orderStatus !== "Completed" && (
            <>
              {order.orderStatus !== "Delivered" && (
                <button
                  className="rounded-md bg-red-600 px-3.5 py-1.5 text-base font-semibold leading-7 text-white hover:bg-red-500"
                  onClick={() => (
                    setShowModal(true), setModalTitle("Cancel Order")
                  )}
                >
                  Cancel Order
                </button>
              )}
            </>
          )}
        </div>
      )}
      <p className="text-lg font-bold">Order Status:- {order.orderStatus}</p>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">{modalTitle}</h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>

                {modalTitle === "Update Order Status" && (
                  <div className="relative p-6 flex-auto">
                    <div className="flex justify-between mb-4">
                      <div className="font-bold text-sm">Current Status:</div>
                      <div>{order.orderStatus}</div>
                    </div>
                    <div className="flex justify-between mb-4">
                      <div className="font-bold text-sm">New Status:</div>
                      <select
                        value={newOrderStatus}
                        onChange={(e) => setNewOrderStatus(e.target.value)}
                        className="rounded-md border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      >
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>
                  </div>
                )}

                {modalTitle === "Add Tracking Details" && (
                  <div className="relative p-6 flex-auto">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 mb-5">
                      Enter Tracking Details
                    </h3>
                    <form>
                      <div className="mb-4">
                        <label
                          htmlFor="carrierName"
                          className="block text-gray-700 font-bold mb-2"
                        >
                          Carrier Name:
                        </label>
                        <input
                          id="carrierName"
                          name="carrierName"
                          type="text"
                          className="border rounded-lg py-2 px-3 w-full"
                          onChange={(e) => setCarrierName(e.target.value)}
                          value={carrierName}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor="trackingNumber"
                          className="block text-gray-700 font-bold mb-2"
                        >
                          Tracking Number:
                        </label>
                        <input
                          id="trackingNumber"
                          name="trackingNumber"
                          type="text"
                          className="border rounded-lg py-2 px-3 w-full"
                          onChange={(e) => setTrackingNumber(e.target.value)}
                          value={trackingNumber}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor="trackingUrl"
                          className="block text-gray-700 font-bold mb-2"
                        >
                          Tracking URL:
                        </label>
                        <input
                          id="trackingUrl"
                          name="trackingUrl"
                          type="text"
                          className="border rounded-lg py-2 px-3 w-full"
                          onChange={(e) => setTrackingUrl(e.target.value)}
                          value={trackingUrl}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor="deliveryDate"
                          className="block text-gray-700 font-bold mb-2"
                        >
                          Delivery Date:
                        </label>
                        <input
                          id="deliveryDate"
                          name="deliveryDate"
                          type="date"
                          className="border rounded-lg py-2 px-3 w-full"
                          onChange={(e) => setDeliveryDate(e.target.value)}
                          value={deliveryDate}
                          required
                          min={new Date().toISOString().split("T")[0]}
                        />
                      </div>
                      <div className="mb-4">
                        <label
                          htmlFor="deliveryStatus"
                          className="block text-gray-700 font-bold mb-2"
                        >
                          Delivery Status:
                        </label>
                        <select
                          id="deliveryStatus"
                          name="deliveryStatus"
                          className="border rounded-lg py-2 px-3 w-full"
                          onChange={(e) => setDeliveryStatus(e.target.value)}
                          value={deliveryStatus}
                          required
                        >
                          <option value="">-- Select Status --</option>
                          <option value="In Transit">In Transit</option>
                          <option value="Out for Delivery">
                            Out for Delivery
                          </option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </div>
                    </form>
                  </div>
                )}

                {modalTitle === "Cancel Order" && (
                  <div className="relative p-6 flex-auto">
                    <label
                      htmlFor="cancellationReason"
                      className="block text-gray-700 font-bold mb-2"
                    >
                      Reason for Cancellation:
                    </label>
                    <textarea
                      id="cancellationReason"
                      name="cancellationReason"
                      className="border rounded-lg py-2 px-3 w-full resize-none"
                      rows={4}
                      value={cancellationReason}
                      onChange={(event) =>
                        setCancellationReason(event.target.value)
                      }
                      required
                    />
                  </div>
                )}

                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  {modalTitle === "Update Order Status" && (
                    <button
                      className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => handleUpdateStatus()}
                    >
                      Update Status
                    </button>
                  )}
                  {modalTitle === "Add Tracking Details" && (
                    <button
                      className="bg-yellow-600 text-white active:bg-yellow-700 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => handleAddTrackingDetails()}
                    >
                      Submit
                    </button>
                  )}
                  {modalTitle === "Cancel Order" && (
                    <button
                      className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => handleCancelOrder()}
                      disabled={loading}
                    >
                      {loading ? (
                        <BeatLoader color="#fca5a5" />
                      ) : (
                        "Cancel Order"
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </div>
  ) : (
    <FullPageLoading />
  );
};

export default OrderDetails;
