import React, { useEffect, useRef, useState } from "react";
import CheckIcon from "@heroicons/react/24/outline/CheckIcon";
import { getOrderApi } from "../../../api/order";
import { useNavigate } from "react-router-dom";
import RatingModel from "./RatingModel";
import { CreateToast } from "../../../utils/Toast";
import RefundModel from "./RefundModel";

export function OrderDetails() {
  const [orders, setOrders] = useState<any>(null);
  const [activeOrder, setActiveOrder] = useState<any>();

  // refund model
  const [isRefundOpen, setIsRefundOpen] = useState(false);

  const topRef = useRef<HTMLDivElement>(null);
  // rating model
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  async function getData() {
    const res = await getOrderApi();
    setOrders(res.orders);
    setActiveOrder(res.orders[0]);
  }
  useEffect(() => {
    getData();
  }, []);

  // set active order
  function handleOrder(order: any) {
    setActiveOrder(order);

    setTimeout(() => {
      topRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  }

  return orders !== null ? (
    <div
      dir="ltr"
      className="mx-auto flex w-full max-w-1920 flex-col items-start bg-light py-10 px-2 dark:bg-gray-900 lg:bg-gray-100 xl:flex-row xl:py-14 xl:px-8 2xl:px-14"
    >
      <div ref={topRef} />
      <div className="w-full overflow-hidden lg:flex">
        <div className="w-full pr:0 lg:w-1/3 md:shrink-0 lg:pr-8">
          <div className="flex h-full flex-col bg-white dark:bg-gray-600 pb-5 md:border dark:border-gray-400 ">
            <h3 className="py-5 px-5 text-xl font-semibold text-heading">
              My Orders
            </h3>
            <div className="w-full overflow-y-visible">
              <div className="px-1 md:px-5">
                {orders &&
                  orders.map((order: any, index: any) => (
                    <div
                      onClick={() => handleOrder(order)}
                      role="button"
                      className={`mb-4 flex w-full shrink-0 cursor-pointer flex-col overflow-hidden rounded border-2 bg-gray-100 dark:bg-gray-700 dark:text-white last:mb-0 ${
                        activeOrder._id === order._id && "border-green-600"
                      } `}
                    >
                      <div className="flex items-center justify-between border-b py-3 px-5 md:px-3 lg:px-5 ">
                        <span className="flex shrink-0 text-sm font-bold text-heading ltr:mr-4 rtl:ml-4 lg:text-base">
                          Order
                          <span className="font-normal">#{index + 1}</span>
                        </span>
                        <span
                          className={`max-w-full truncate whitespace-nowrap rounded px-3 py-2 text-sm text-white ${
                            order.orderStatus === "Placed"
                              ? "bg-[#F59E0B]"
                              : order.orderStatus === "Confirmed"
                              ? "bg-[#EAB308]"
                              : order.orderStatus === "Shipped"
                              ? "bg-green-600"
                              : order.orderStatus === "Delivered"
                              ? "bg-green-600"
                              : order.orderStatus === "Completed"
                              ? "bg-green-600"
                              : order.orderStatus === "Payment Failed"
                              ? "bg-red-600"
                              : order.orderStatus === "Cancelled"
                              ? "bg-[#9CA3AF]"
                              : order.orderStatus === "Returned"
                              ? "bg-red-600"
                              : ""
                          }`}
                          title={order.orderStatus}
                        >
                          Order {order.orderStatus}
                        </span>
                      </div>
                      <div className="flex flex-col p-5 md:p-3 lg:px-4 lg:py-5">
                        <p className="mb-4 flex w-full items-center justify-between text-sm text-heading last:mb-0">
                          <span className="w-24 shrink-0 overflow-hidden">
                            Order Date
                          </span>
                          <span className="ltr:mr-auto rtl:ml-auto">:</span>
                          <span className="ltr:ml-1 rtl:mr-1">
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-US",
                              { month: "long", day: "numeric", year: "numeric" }
                            )}
                          </span>
                        </p>
                        <p className="mb-4 flex w-full items-center justify-between text-sm text-heading last:mb-0">
                          <span className="w-24 shrink-0 overflow-hidden">
                            Delivery Time
                          </span>
                          <span className="ltr:mr-auto rtl:ml-auto">:</span>
                          <span className="truncate ltr:ml-1 rtl:mr-1">
                            {order?.trackingDetails?.deliveryDate ? (
                              new Date(
                                order?.trackingDetails?.deliveryDate
                              ).toLocaleDateString("en-US", {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              })
                            ) : (
                              <>Order In Review</>
                            )}
                          </span>
                        </p>
                        <p className="mb-4 flex w-full items-center justify-between text-sm font-bold text-heading last:mb-0">
                          <span className="w-24 shrink-0 overflow-hidden">
                            Amount
                          </span>
                          <span className="ltr:mr-auto rtl:ml-auto">:</span>
                          <span className="ltr:ml-1 rtl:mr-1">
                            ₹{order.orderAmount}
                          </span>
                        </p>
                        <p className="mb-4 flex w-full items-center justify-between text-sm font-bold text-heading last:mb-0">
                          <span className="w-24 flex-shrink-0 overflow-hidden">
                            Total Price
                          </span>
                          <span className="ltr:mr-auto rtl:ml-auto">:</span>
                          <span className="ltr:ml-1 rtl:mr-1">
                            ₹{order.totalDiscount}
                          </span>
                        </p>
                        <p className="mb-4 flex w-full items-center justify-between text-sm font-bold text-heading last:mb-0">
                          <span className="w-24 flex-shrink-0 overflow-hidden">
                            Total Price
                          </span>
                          <span className="ltr:mr-auto rtl:ml-auto">:</span>
                          <span className="ltr:ml-1 rtl:mr-1">
                            ₹{order.orderTotal}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
        {activeOrder && (
          <div className="flex w-full flex-col lg:w-2/3 ">
            <div className="bg-white dark:bg-gray-700 border dark:border-gray-400">
              <div className="flex flex-col items-center p-5 md:flex-row md:justify-between">
                <h2 className="mb-2 dark:text-white flex text-sm font-semibold text-heading md:text-lg">
                  Order Details <span className="px-2">-</span>{" "}
                  {activeOrder.orderId.split("_")[1]}
                </h2>
                <div className="flex items-center">
                  {activeOrder.orderStatus !== "Returned" && (
                    <>
                      {activeOrder.orderStatus !== "Completed" && (
                        <>
                          {activeOrder.orderStatus !== "Cancelled" && (
                            <button
                              onClick={() => setIsRefundOpen(true)}
                              className="flex items-center text-sm font-semibold text-gray-500 dark:text-gray-200 transition-colors hover:text-accent disabled:cursor-not-allowed disabled:text-gray-400 disabled:hover:text-gray-400 ltr:mr-4 rtl:ml-4"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 106.059 106.059"
                                fill="currentColor"
                                width={18}
                                className="ltr:mr-2 rtl:ml-2"
                              >
                                <path d="M90.546 15.518c-20.688-20.69-54.347-20.69-75.031-.005-20.688 20.685-20.686 54.345.002 75.034 20.682 20.684 54.341 20.684 75.027-.004 20.686-20.685 20.685-54.343.002-75.025zm-5.789 69.24c-17.494 17.494-45.96 17.496-63.455.002-17.498-17.497-17.496-45.966 0-63.46 17.494-17.493 45.959-17.495 63.457.002 17.494 17.494 17.492 45.963-.002 63.456zm-7.74-10.757a2.998 2.998 0 0 1-1.562 3.943 2.998 2.998 0 0 1-3.944-1.562c-2.893-6.689-9.73-11.012-17.421-11.012-7.868 0-14.747 4.319-17.522 11.004a3.002 3.002 0 0 1-3.921 1.621 3 3 0 0 1-1.62-3.921c3.71-8.932 12.764-14.703 23.063-14.703 10.084 0 19.084 5.742 22.927 14.63zM33.24 38.671a6.201 6.201 0 1 1 12.4 0 6.201 6.201 0 0 1-12.4 0zm28.117 0a6.201 6.201 0 0 1 12.403 0c0 3.426-2.776 6.202-6.2 6.202s-6.203-2.776-6.203-6.202z" />
                              </svg>
                              Ask for a refund
                            </button>
                          )}
                          <RefundModel
                            isOpen={isRefundOpen}
                            closeModal={() => setIsRefundOpen(false)}
                            orderId={activeOrder?._id}
                          />
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
              <div className="relative mx-5 mb-6 overflow-hidden rounded">
                <div className="bg-[#F7F8FA] dark:bg-gray-500 px-7 py-4">
                  <div className="mb-0 flex flex-col flex-wrap items-center justify-between gap-x-8 text-base font-bold text-heading sm:flex-row lg:flex-nowrap">
                    <div className="order-2 flex w-full gap-6 xs:flex-nowrap sm:order-1 max-w-full basis-full justify-between">
                      <div className="flex flex-wrap items-center">
                        <span className="dark:text-white mb-2 block text-xs xs:text-base lg:mb-0 lg:inline-block lg:ltr:mr-4 lg:rtl:ml-4">
                          Order Status :
                        </span>
                        <div className="w-full lg:w-auto">
                          <span
                            className={`px-3 py-2 rounded-full text-center text-white text-sm  min-h-[2rem] items-center justify-center !leading-none xs:text-sm inline-flex ${
                              activeOrder.orderStatus === "Placed"
                                ? "bg-[#F59E0B]"
                                : activeOrder.orderStatus === "Confirmed"
                                ? "bg-[#EAB308]"
                                : activeOrder.orderStatus === "Shipped"
                                ? "bg-green-600"
                                : activeOrder.orderStatus === "Delivered"
                                ? "bg-green-600"
                                : activeOrder.orderStatus === "Completed"
                                ? "bg-green-600"
                                : activeOrder.orderStatus === "Payment Failed"
                                ? "bg-red-600"
                                : activeOrder.orderStatus === "Cancelled"
                                ? "bg-[#9CA3AF]"
                                : activeOrder.orderStatus === "Returned"
                                ? "bg-red-600"
                                : ""
                            }`}
                            title={activeOrder.orderStatus}
                          >
                            Order {activeOrder.orderStatus}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center">
                        <span className="dark:text-white mb-2 block text-xs xs:text-base lg:mb-0 lg:inline-block lg:ltr:mr-4 lg:rtl:ml-4">
                          Payment Status :
                        </span>
                        <div className="w-full lg:w-auto">
                          <span
                            className={`px-3 py-2 rounded-full text-sm text-center text-white min-h-[2rem] items-center justify-center !leading-none xs:text-sm inline-flex ${
                              activeOrder.transactionId.status === "Completed"
                                ? "bg-green-600"
                                : activeOrder.transactionId.status === "Failed"
                                ? "bg-red-600"
                                : activeOrder.transactionId.status ===
                                  "Refunded"
                                ? "bg-yellow-600"
                                : "bg-gray-600"
                            }`}
                          >
                            {activeOrder.transactionId.status === "Completed"
                              ? "Paid"
                              : activeOrder.transactionId.status === "Failed"
                              ? "Failed"
                              : activeOrder.transactionId.status === "Refunded"
                              ? "Refunded"
                              : "Pending"}
                            {" via "}
                            {activeOrder.transactionId.paymentMethod}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col border-b sm:flex-row">
                <div className="flex w-full flex-col border-b px-5 py-4 sm:border-b-0 ltr:sm:border-r rtl:sm:border-l md:w-3/5">
                  <div className="mb-4">
                    <span className="dark:text-white mb-2 block text-sm font-bold text-heading">
                      Shipping Address
                    </span>
                    <span className="dark:text-gray-300 text-sm text-gray-500">
                      {activeOrder.fullname}
                      <br />
                      {activeOrder.shippingAddress}
                    </span>
                  </div>
                  <div>
                    <span className="dark:text-white mb-2 block text-sm font-bold text-heading">
                      Billing Address
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-300">
                      {activeOrder.fullname}
                      <br />
                      {activeOrder.shippingAddress}
                    </span>
                  </div>
                </div>
                <div className="flex w-full flex-col px-5 py-4 md:w-2/5">
                  <div className="mb-3 flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-300">
                      Sub Total
                    </span>
                    <span className="text-sm text-heading dark:text-gray-300">
                      ₹{activeOrder.orderAmount}
                    </span>
                  </div>
                  <div className="mb-3 flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-300">
                      Discount
                    </span>
                    <span className="text-sm text-heading dark:text-gray-300">
                      ₹{activeOrder.totalDiscount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-bold text-heading dark:text-white">
                      Total
                    </span>
                    <span className="text-sm font-bold text-heading dark:text-white">
                      ₹{activeOrder.orderTotal}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                {activeOrder.orderStatus !== "Cancelled" &&
                  activeOrder.orderStatus !== "Returned" && (
                    <div className="flex w-full items-center justify-center px-6">
                      <div className="h-full w-full dark:text-white">
                        <div className="flex flex-col md:flex-row py-7">
                          <div className="flex md:flex-col w-full md:w-1/5 relative pb-6 ">
                            <div className="flex justify-center items-center md:mb-4">
                              <div
                                className={`bg-green-600 absolute top-1/2 md:top-auto md:left-1/2 h-1/4 md:h-1 w-1 md:w-1/2`}
                              />
                              <div className="p-2 z-10 bg-green-600 rounded-full">
                                <CheckIcon
                                  className="h-4 w-4 text-white"
                                  strokeWidth={4}
                                />
                              </div>
                            </div>
                            <div className="text-base font-semibold capitalize text-body-dark ltr:text-left rtl:text-right md:px-2 md:!text-center ml-2 md:ml-0">
                              Order Placed
                            </div>
                          </div>
                          <div className="flex md:flex-col w-full md:w-1/5 relative pb-6 ">
                            <div className="flex justify-center items-center md:mb-4">
                              <div
                                className={`${
                                  activeOrder.orderStatus === "Confirmed" ||
                                  activeOrder.orderStatus === "Shipped" ||
                                  activeOrder.orderStatus === "Delivered" ||
                                  activeOrder.orderStatus === "Completed"
                                    ? "bg-green-600"
                                    : "bg-gray-200"
                                } absolute -top-1/4 md:top-auto md:left-0 h-full md:h-1 w-1 md:w-full`}
                              />

                              {activeOrder.orderStatus === "Confirmed" ||
                              activeOrder.orderStatus === "Shipped" ||
                              activeOrder.orderStatus === "Delivered" ||
                              activeOrder.orderStatus === "Completed" ? (
                                <div className="p-2 z-10 bg-green-600 rounded-full">
                                  <CheckIcon
                                    className="h-4 w-4 text-white"
                                    strokeWidth={4}
                                  />
                                </div>
                              ) : (
                                <div className="z-10 h-8 w-8 border-dashed bg-white  dark:bg-gray-700 text-green-600 border border-green-600 rounded-full justify-center items-center flex">
                                  <span className="h-4 w-4 text-green-600 justify-center items-center flex">
                                    2
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="text-base font-semibold capitalize text-body-dark ltr:text-left rtl:text-right md:px-2 md:!text-center ml-2 md:ml-0">
                              Order Confirmed
                            </div>
                          </div>
                          <div className="flex md:flex-col w-full md:w-1/5 relative pb-6 ">
                            <div className="flex justify-center items-center md:mb-4">
                              <div
                                className={`${
                                  activeOrder.orderStatus === "Shipped" ||
                                  activeOrder.orderStatus === "Delivered" ||
                                  activeOrder.orderStatus === "Completed"
                                    ? "bg-green-600"
                                    : "bg-gray-200"
                                } absolute -top-1/4 md:top-auto md:left-0 h-full md:h-1 w-1 md:w-full`}
                              />

                              {activeOrder.orderStatus === "Shipped" ||
                              activeOrder.orderStatus === "Delivered" ||
                              activeOrder.orderStatus === "Completed" ? (
                                <div className="p-2 z-10 bg-green-600 rounded-full">
                                  <CheckIcon
                                    className="h-4 w-4 text-white"
                                    strokeWidth={4}
                                  />
                                </div>
                              ) : (
                                <div className="z-10 h-8 w-8 border-dashed bg-white  dark:bg-gray-700 text-green-600 border border-green-600 rounded-full justify-center items-center flex">
                                  <span className="h-4 w-4 text-green-600 justify-center items-center flex">
                                    3
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="text-base font-semibold capitalize text-body-dark ltr:text-left rtl:text-right md:px-2 md:!text-center ml-2 md:ml-0">
                              Order Shipped
                            </div>
                          </div>
                          <div className="flex md:flex-col w-full md:w-1/5 relative pb-6 ">
                            <div className="flex justify-center items-center md:mb-4">
                              <div
                                className={`${
                                  activeOrder.orderStatus === "Delivered" ||
                                  activeOrder.orderStatus === "Completed"
                                    ? "bg-green-600"
                                    : "bg-gray-200"
                                } absolute -top-1/4 md:top-auto md:left-0 h-full md:h-1 w-1 md:w-full`}
                              />

                              {activeOrder.orderStatus === "Delivered" ||
                              activeOrder.orderStatus === "Completed" ? (
                                <div className="p-2 z-10 bg-green-600 rounded-full">
                                  <CheckIcon
                                    className="h-4 w-4 text-white"
                                    strokeWidth={4}
                                  />
                                </div>
                              ) : (
                                <div className="z-10 h-8 w-8 border-dashed bg-white  dark:bg-gray-700 text-green-600 border border-green-600 rounded-full justify-center items-center flex">
                                  <span className="h-4 w-4 text-green-600 justify-center items-center flex">
                                    4
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="text-base font-semibold capitalize text-body-dark ltr:text-left rtl:text-right md:px-2 md:!text-center ml-2 md:ml-0">
                              Order Delivered
                            </div>
                          </div>
                          <div className="flex md:flex-col w-full md:w-1/5 relative pb-6 ">
                            <div className="flex justify-center items-center md:mb-4">
                              <div
                                className={`${
                                  activeOrder.orderStatus === "Completed"
                                    ? "bg-green-600"
                                    : "bg-gray-200"
                                } absolute -top-1/4 md:top-auto md:left-0 h-full md:h-1 w-1 md:w-full`}
                              />

                              {activeOrder.orderStatus === "Completed" ? (
                                <div className="p-2 z-10 bg-green-600 rounded-full">
                                  <CheckIcon
                                    className="h-4 w-4 text-white"
                                    strokeWidth={4}
                                  />
                                </div>
                              ) : (
                                <div className="z-10 h-8 w-8 border-dashed bg-white  dark:bg-gray-700 text-green-600 border border-green-600 rounded-full justify-center items-center flex">
                                  <span className="h-4 w-4 text-green-600 justify-center items-center flex">
                                    5
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="text-base font-semibold capitalize text-body-dark ltr:text-left rtl:text-right md:px-2 md:!text-center ml-2 md:ml-0">
                              Order Completed
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                <div className="border-t border-gray-400">
                  {activeOrder.products.map((product: any) => (
                    <div key={product._id} className="px-4">
                      <li className="flex py-6 sm:py-6 ">
                        {product?.product !== null && (
                          <div className="flex-shrink-0">
                            <img
                              src={product?.product.thumbnailUrl}
                              alt={product?.product.productName}
                              className="h-24 w-24 rounded-md object-contain object-center sm:h-38 sm:w-38"
                            />
                          </div>
                        )}

                        <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                          <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                            <div>
                              <div className="flex justify-between">
                                {product?.product !== null && (
                                  <h3 className="text-sm">
                                    <span className="font-medium text-lg text-gray-700 dark:text-white">
                                      {product?.product.productName}
                                    </span>
                                  </h3>
                                )}
                              </div>

                              <div className="mt-1 flex text-sm">
                                <p className="text-gray-500 dark:text-gray-200">
                                  Quantity:{" "}
                                  <span className="font-bold">
                                    {product?.quantity}
                                  </span>
                                </p>
                              </div>
                              <div className="mt-1 flex items-end">
                                <p className="text-xs line-through font-medium text-gray-500 dark:text-gray-100">
                                  ₹{product?.price}
                                </p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  &nbsp;&nbsp;₹{product?.discountedPrice}
                                </p>
                                &nbsp;&nbsp;
                                <p className="text-sm font-medium text-green-500">
                                  ₹{product?.price - product?.discountedPrice}
                                </p>
                              </div>
                            </div>

                            {activeOrder.orderStatus === "Completed" && (
                              <>
                                <div className="flex items-end justify-end flex-col">
                                  <button
                                    type="button"
                                    onClick={() => setIsOpen(true)}
                                    className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:focus:ring-yellow-900"
                                  >
                                    Rate Product
                                  </button>
                                </div>
                              </>
                            )}
                            <RatingModel
                              isOpen={isOpen}
                              closeModal={() => setIsOpen(false)}
                              product={product}
                            />
                          </div>
                        </div>
                      </li>
                    </div>
                  ))}
                </div>
                {activeOrder.orderStatus === "Cancelled" && (
                  <div className="p-4 bg-white rounded-md shadow-md">
                    {activeOrder?.notes?.cancelOrderReason ? (
                      <>
                        <h3 className="text-lg font-medium text-gray-800 mb-2">
                          Cancel Order Reason
                        </h3>
                        <p className="text-gray-700">
                          {activeOrder.notes.cancelOrderReason}
                        </p>
                      </>
                    ) : (
                      <p className="text-gray-700">
                        No cancel order reason provided.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
            {/* Tracking Details */}
            {activeOrder.orderStatus !== "Cancelled" &&
              activeOrder.orderStatus !== "Returned" &&
              activeOrder.trackingDetails && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-2xl font-bold mb-4">Tracking Details</h2>
                  <div className="mb-2 md:mb-0">
                    <span className="text-gray-500 font-medium mr-2">
                      Carrier:
                    </span>
                    <span>
                      {activeOrder.trackingDetails.carrierName || "N/A"}
                    </span>
                  </div>

                  <div className="mb-2 md:mb-0">
                    <span className="text-gray-500 font-medium mr-2">
                      Tracking Number:
                    </span>
                    <span>
                      {activeOrder.trackingDetails.trackingNumber || "N/A"}
                    </span>
                  </div>
                  <div className="mb-2 md:mb-0">
                    <span className="text-gray-500 font-medium mr-2">
                      Delivery Date:
                    </span>
                    <span>
                      {activeOrder.trackingDetails.deliveryDate
                        ? new Date(
                            activeOrder.trackingDetails.deliveryDate
                          ).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                  <div className="mb-2 md:mb-0">
                    <span className="text-gray-500 font-medium mr-2">
                      Delivery Status:
                    </span>
                    <span
                      className={`capitalize ${
                        activeOrder.trackingDetails.deliveryStatus ===
                        "Delivered"
                          ? "text-green-500"
                          : activeOrder.trackingDetails.deliveryStatus ===
                            "Out for Delivery"
                          ? "text-yellow-500"
                          : activeOrder.trackingDetails.deliveryStatus ===
                            "In Transit"
                          ? "text-blue-500"
                          : "text-red-500"
                      }`}
                    >
                      {activeOrder.trackingDetails.deliveryStatus || "N/A"}
                    </span>
                  </div>
                  <div className="mt-4">
                    {activeOrder.trackingDetails.trackingUrl && (
                      <a
                        href={activeOrder.trackingDetails.trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        Track Shipment
                      </a>
                    )}
                  </div>
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className="col-span-3 flex flex-col px-4 py-6 sm:py-6">
      <p className="text-xl font-semibold mb-4">No order found</p>
      <button
        className="px-4 py-2 bg-indigo-500 text-white rounded-md shadow-md hover:bg-indigo-600 transition duration-200"
        onClick={() => {
          navigate("/shop");
        }}
      >
        Shop now
      </button>
    </div>
  );
}
