import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { approveRefund, getRefundRequestById } from "../../api/order";
import { CreateToast } from "../../utils/Toast";
import { ClipLoader } from "react-spinners";

const RefundDetails = () => {
  const { refundId } = useParams();
  // refund details
  const [refund, setRefund] = useState<any>(undefined);
  const [customer, setCustomer] = useState<any>({});
  const [order, setOrder] = useState<any>({});
  const [transaction, setTransaction] = useState<any>({});
  const [bankDetails, setBankDetails] = useState<any>({});

  // loading
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async () => {
    try {
      const result = await getRefundRequestById(refundId);
      setOrder(result.refund.orderId);
      setCustomer(result.refund.customer);
      setTransaction(result.refund.transactionId);
      setBankDetails(result.refund.bankDetails);
      delete result.refund.order;
      delete result.refund.customer;
      delete result.refund.transaction;
      delete result.refund.bankDetails;
      setRefund(result.refund);
    } catch (error) {}
  };

  useEffect(() => {
    fetchData();
  }, []);

  const navigate = useNavigate();

  const handleTransferRefund = async () => {
    try {
      setLoading(true);
      const result = await approveRefund(refundId);
      if (result.status === "success") {
        CreateToast("refundamount", result.message, "success");
        navigate("/orderrefund");
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return refund !== undefined ? (
    <div>
      <div className="flex flex-col">
        <div className="bg-white rounded-lg shadow-md p-6 my-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium">Order Details</h2>
            <span className="text-gray-400 text-sm">
              {new Date(order?.createdAt).toLocaleString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                minute: "numeric",
                hour: "numeric",
                second: "numeric",
              })}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div>
              <span className="text-gray-500 font-medium">Order ID:</span>
              <br />
              <span className="text-gray-600">{order.orderId}</span>
            </div>
            <div>
              <span className="text-gray-500 font-medium">Transaction ID:</span>
              <br />
              <span className="text-gray-600">{order.transactionId}</span>
            </div>
            <div>
              <span className="text-gray-500 font-medium">Order Status:</span>
              <br />
              <span
                className={`${
                  order.orderStatus === "Cancelled"
                    ? "text-red-500"
                    : "text-green-500"
                } font-medium`}
              >
                {order.orderStatus}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div>
              <span className="text-gray-500 font-medium">Customer Name:</span>
              <br />
              <span className="text-gray-600">{order.fullname}</span>
            </div>
            <div>
              <span className="text-gray-500 font-medium">
                Shipping Address:
              </span>
              <br />
              <span className="text-gray-600">{order.shippingAddress}</span>
            </div>
          </div>
          <div className="mb-8">
            <span className="text-gray-500 font-medium">Products:</span>
            <br />
            {order.products.map((product: any) => (
              <div key={product._id} className="grid grid-cols-3 gap-4 my-4">
                <div>
                  <span className="text-gray-500 font-medium">
                    Product Name:
                  </span>
                  <br />
                  <span className="text-gray-600">{product.product}</span>
                </div>
                <div>
                  <span className="text-gray-500 font-medium">Quantity:</span>
                  <br />
                  <span className="text-gray-600">{product.quantity}</span>
                </div>
                <div>
                  <span className="text-gray-500 font-medium">Price:</span>
                  <br />
                  <span className="text-gray-600">{product.price}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div>
              <span className="text-gray-500 font-medium">Order Amount:</span>
              <br />
              <span className="text-gray-600">{order.orderAmount}</span>
            </div>
            <div>
              <span className="text-gray-500 font-medium">Total Discount:</span>
              <br />
              <span className="text-gray-600">{order.totalDiscount}</span>
            </div>
            <div>
              <span className="text-gray-500 font-medium">Order Total:</span>
              <br />
              <span className="text-gray-600">{order.orderTotal}</span>
            </div>
          </div>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md my-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium">{customer?.name}</h2>
            <span
              className={`px-2 py-1 rounded-lg ${
                customer?.banStatus?.isBanned
                  ? "bg-red-500 text-white"
                  : "bg-green-500 text-white"
              }`}
            >
              {customer?.banStatus?.isBanned ? "Banned" : "Active"}
            </span>
          </div>
          <div className="mt-4">
            <div className="flex items-center mb-2">
              <span className="font-medium mr-2">Username:</span>
              <span>{customer?.username}</span>
            </div>
            <div className="flex items-center mb-2">
              <span className="font-medium mr-2">Email:</span>
              <span>{customer?.email}</span>
            </div>
            <div className="flex items-center mb-2">
              <span className="font-medium mr-2">Verification Status:</span>
              <span>
                {customer?.verificationStatus ? "Verified" : "Not Verified"}
              </span>
            </div>
            <div className="flex items-center mb-2">
              <span className="font-medium mr-2">Role:</span>
              <span>{customer?.role}</span>
            </div>
            <div className="flex items-center mb-2">
              <span className="font-medium mr-2">Created At:</span>
              <span>{new Date(customer?.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center mb-2">
              <span className="font-medium mr-2">Updated At:</span>
              <span>{new Date(customer?.updatedAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center mb-2">
              <span className="font-medium mr-2">Seller:</span>
              <span>{customer?.seller}</span>
            </div>
            <div className="flex items-center mb-2">
              <span className="font-medium mr-2">Address:</span>
              <span>{customer?.address}</span>
            </div>
            <div className="flex items-center mb-2">
              <span className="font-medium mr-2">Number:</span>
              <span>{customer?.number}</span>
            </div>
          </div>
        </div>
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
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-4 my-4">
          <div className="px-4 py-5 sm:px-6">
            <h1 className="text-2xl font-bold mb-4">Refund Details</h1>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Bank Details
            </h3>
            <div className="mt-5 flex flex-col">
              <span className="text-gray-500">Account Holder Name:</span>
              <span>{bankDetails?.accountHolderame}</span>
            </div>
            <div className="mt-2 flex flex-col">
              <span className="text-gray-500">Bank Name:</span>
              <span>{bankDetails?.bankName}</span>
            </div>
            <div className="mt-2 flex flex-col">
              <span className="text-gray-500">Account Number:</span>
              <span>{bankDetails?.accountNumber}</span>
            </div>
            <div className="mt-2 flex flex-col">
              <span className="text-gray-500">IFSC Code:</span>
              <span>{bankDetails?.ifscCode}</span>
            </div>
            <div className="flex items-center justify-end">
              <button
                onClick={() => handleTransferRefund()}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Transfer Refund Amount
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <>loading</>
  );
};

export default RefundDetails;
