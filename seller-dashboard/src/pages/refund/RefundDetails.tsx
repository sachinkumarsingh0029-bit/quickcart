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
import { getRefundById, updateRefundStatus } from "../../api/refund";

const OrderDetails = () => {
  const { refundId } = useParams();
  const [order, setOrder] = React.useState<any>({});
  const [transaction, setTransaction] = React.useState<any>({});
  const [user, setUser] = React.useState<any>({});
  const [refund, setRefund] = React.useState<any>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    const result = await getRefundById(refundId);
    setOrder(result.refundRequest.orderId);
    setTransaction(result.refundRequest.transactionId);
    setUser(result.refundRequest.customer);
    setRefund(result.refundRequest);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAccept = async () => {
    try {
      const result = await updateRefundStatus(refund._id, "Approved");
      CreateToast("handleAccept", result.message, "success");
      fetchData();
    } catch (error) {}
  };

  const handleReject = async () => {
    try {
      const result = await updateRefundStatus(refund._id, "Rejected");
      CreateToast("handleAccept", result.message, "success");
      fetchData();
    } catch (error) {}
  };

  const handleReceivedProduct = async () => {
    try {
      const result = await updateRefundStatus(
        refund._id,
        "Seller Received Products"
      );
      CreateToast("handleAccept", result.message, "success");
      fetchData();
    } catch (error) {}
  };

  return order ? (
    <div className="bg-white shadow rounded-md p-6 mt-10">
      <div className="flex justify-between mb-6">
        <h2 className="text-lg font-bold">Refund #{refundId}</h2>
        <p className="text-gray-500">
          {new Date(refund.createdAt).toLocaleString()}
        </p>
      </div>
      <hr className="border-gray-300 mb-6" />
      {/* order details */}
      <div className="mb-6">
        <h3 className="text-sm font-bold mb-2">Shipping Address</h3>
        <p>{order?.fullname}</p>
        <p>{order?.number}</p>
        <p>{order?.shippingAddress}</p>
      </div>
      <div className="mb-6">
        <h3 className="text-sm font-bold mb-2">Order Details</h3>
        {order?.products?.map((item: any) => (
          <div key={item?._id} className="flex items-center space-x-3">
            <div className="flex-shrink-0 h-10 w-10">
              <img
                className="h-10 w-10 rounded-full mr-3"
                src={item?.product?.thumbnailUrl}
                alt={item?.product?.productName}
              />
            </div>
            <div className="flex-1">
              <p className="font-bold">{item?.product?.productName}</p>
              <p className="text-gray-900">
                <span className="font-medium">{item?.quantity} Unit </span>
                <span className="font-medium text-red-500">x</span>
                <span className="font-medium ml-1">
                  ₹{item?.discountedPrice}
                </span>
              </p>
            </div>
          </div>
        ))}
        <div className="mt-10">
          <div className="flex justify-between font-bold mb-2">
            <div className="text-gray-900">Amount</div>
            <div className="text-gray-900">₹{order?.orderAmount}</div>
          </div>
          <div className="flex justify-between font-bold mb-2">
            <div className="text-gray-900">Discount</div>
            <div className="text-gray-900">- ₹{order?.totalDiscount}</div>
          </div>
          <div className="flex justify-between font-bold mb-2">
            <div className="text-gray-900">Total</div>
            <div className="text-green-500">₹{order?.orderTotal}</div>
          </div>
        </div>
      </div>
      <p className="text-lg font-bold">Order Status:- {order?.orderStatus}</p>
      <hr className="border-gray-300 m-6" />
      {/* refund request */}
      <div className="bg-white shadow-md rounded px-8 py-6 mb-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-2xl">{`Refund Request (${refund._id})`}</h2>
          <span
            className={`text-sm uppercase font-bold ${
              refund.status === "Pending"
                ? "text-yellow-500"
                : refund.status === "Approved"
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {refund.status}
          </span>
        </div>
        <p className="text-gray-700 mb-2">{`Reason: ${refund.reason}`}</p>
        <p className="text-gray-700 mb-2">{`Amount: ₹${refund.amount}`}</p>
        <p className="text-gray-700 mb-2">{`Seller: ${refund.seller}`}</p>
        <p className="text-gray-700 mb-2">{`Created At: ${new Date(
          refund.createdAt
        ).toLocaleString()}`}</p>
        <p className="text-gray-700 mb-2">{`Updated At: ${new Date(
          refund.updatedAt
        ).toLocaleString()}`}</p>
        {refund.status === "Pending" && (
          <div className="flex justify-end space-x-4 mb-6">
            <button
              onClick={handleAccept}
              className="rounded-md bg-green-600 px-3.5 py-1.5 text-base font-semibold leading-7 text-white hover:bg-green-500"
            >
              Approve
            </button>
            <button
              onClick={handleReject}
              className="rounded-md bg-red-600 px-3.5 py-1.5 text-base font-semibold leading-7 text-white hover:bg-red-500"
            >
              Reject
            </button>
          </div>
        )}
        {refund.status === "Approved" && (
          <div className="flex justify-end space-x-4 mb-6">
            <button
              onClick={handleReceivedProduct}
              className="rounded-md bg-yellow-600 px-3.5 py-1.5 text-base font-semibold leading-7 text-white hover:bg-yellow-500"
            >
              Received Products
            </button>
          </div>
        )}
      </div>
      {/* User deatils */}
      <div className="border border-gray-300 rounded-md p-4">
        <h1 className="text-lg font-medium mb-2">
          {user?.username || "Deleted User"}
        </h1>
        <p className="text-gray-500 mb-4">{user?.email || ""}</p>
        <div className="flex mb-4">
          <span className="mr-2">Role:</span>
          <span className="font-medium">{user?.role || ""}</span>
        </div>
        <div className="flex mb-4">
          <span className="mr-2">Address:</span>
          <span className="font-medium">{user?.address || ""}</span>
        </div>
        <div className="flex mb-4">
          <span className="mr-2">Phone:</span>
          <span className="font-medium">{user?.number || ""}</span>
        </div>
        <div className="flex mb-4">
          <span className="mr-2">Name:</span>
          <span className="font-medium">{user?.name || ""}</span>
        </div>
      </div>
      <hr className="border-gray-300 m-6" />
      {/* transaction deatils */}
      <div className="border border-gray-400 rounded-lg p-4 my-4">
        <div className="flex justify-between mb-4">
          <span className="font-bold">Transaction ID:</span>
          <span>{transaction.trans_id}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="font-bold">Customer ID:</span>
          <span>{transaction.customer}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="font-bold">Type:</span>
          <span>{transaction.type}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="font-bold">Amount:</span>
          <span>₹{transaction.amount}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="font-bold">Refunded Amount:</span>
          <span>₹{transaction?.refundedAmount}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="font-bold">Status:</span>
          <span>{transaction.status}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="font-bold">Payment Method:</span>
          <span>{transaction.paymentMethod}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="font-bold">Version:</span>
          <span>{transaction.version}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="font-bold">Created At:</span>
          <span>{new Date(transaction.createdAt).toLocaleString()}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="font-bold">Previous Transaction:</span>
          <span>
            {transaction.previous ? transaction.previous.trans_id : "N/A"}
          </span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="font-bold">Cart ID:</span>
          <span>{transaction.cartId}</span>
        </div>
      </div>
    </div>
  ) : (
    <FullPageLoading />
  );
};

export default OrderDetails;
