import React from "react";

const OrderDetails = ({ order }: any) => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col">
        <div className="flex flex-wrap sm:flex-row mb-2">
          <div className="sm:w-2/5 mb-2 sm:mb-0">
            <h4 className="font-semibold text-gray-600 text-lg">Order ID:</h4>
            <p
              className="font-medium text-gray-800 text-sm"
              style={{ wordBreak: "break-all" }}
            >
              {order.orderId}
            </p>
          </div>

          <div className="sm:w-2/5 mb-2 sm:mb-0">
            <h4 className="font-semibold text-gray-600 text-lg">Order Date:</h4>
            <p className="font-medium text-gray-800">
              {new Date(order.orderDate).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="sm:w-1/5 mb-2 sm:mb-0">
            <h4 className="font-semibold text-gray-600 text-lg">Status:</h4>
            <p className="font-medium text-gray-800">{order.orderStatus}</p>
          </div>
        </div>
        <div className="flex flex-wrap sm:flex-row mb-6">
          <div className="sm:w-2/5 mb-2 sm:mb-0">
            <h4 className="font-semibold text-gray-600 text-lg">Full Name:</h4>
            <p className="font-medium text-gray-800">{order.fullname}</p>
          </div>
          <div className="sm:w-2/5 mb-2 sm:mb-0">
            <h4 className="font-semibold text-gray-600 text-lg">
              Shipping Address:
            </h4>
            <p
              className="font-medium text-gray-800 text-sm"
              style={{ wordBreak: "break-all" }}
            >
              {order.shippingAddress}
            </p>
          </div>
          <div className="sm:w-1/5 mb-2 sm:mb-0">
            <h4 className="font-semibold text-gray-600 text-lg">Phone:</h4>
            <p className="font-medium text-gray-800">{order.number}</p>
          </div>
        </div>
        <div className="flex flex-wrap sm:flex-row mb-6">
          <div className="sm:w-2/5 mb-2 sm:mb-0">
            <h4 className="font-semibold text-gray-600 text-lg">
              Order Amount:
            </h4>
            <p className="font-medium text-gray-800">{order.orderAmount}</p>
          </div>
          <div className="sm:w-2/5 mb-2 sm:mb-0">
            <h4 className="font-semibold text-gray-600 text-lg">
              Total Discount:
            </h4>
            <p className="font-medium text-gray-800">{order.totalDiscount}</p>
          </div>
          <div className="sm:w-1/5 mb-2 sm:mb-0">
            <h4 className="font-semibold text-gray-600 text-lg">
              Order Total:
            </h4>
            <p className="font-medium text-gray-800">{order.orderTotal}</p>
          </div>
        </div>
        <div className="flex flex-wrap sm:flex-row mb-6">
          <div className="sm:w-2/5 mb-2 sm:mb-0">
            <h4 className="font-semibold text-gray-600 text-lg">Cart ID:</h4>
            <p
              className="font-medium text-gray-800 text-sm"
              style={{ wordBreak: "break-all" }}
            >
              {order.cartId}
            </p>
          </div>
          <div className="sm:w-2/5 mb-2 sm:mb-0">
            <h4 className="font-semibold text-gray-600 text-lg">Seller:</h4>
            <p className="font-medium text-gray-800">
              {order.seller.businessUsername}
            </p>
          </div>
          <div className="sm:w-1/5 mb-2 sm:mb-0">
            <h4 className="font-semibold text-gray-600 text-lg">Customer:</h4>
            <p className="font-medium text-gray-800">
              {order.customer.username}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap sm:flex-row mb-6">
          <div className="sm:w-2/5 mb-2 sm:mb-0">
            <h4 className="font-semibold text-gray-600 text-lg">
              Transaction ID:
            </h4>
            <p
              className="font-medium text-gray-800 text-sm"
              style={{ wordBreak: "break-all" }}
            >
              {order.transactionId}
            </p>
          </div>
          <div className="sm:w-2/5 mb-2 sm:mb-0">
            <h4 className="font-semibold text-gray-600 text-lg">Created At:</h4>
            <p className="font-medium text-gray-800">
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="sm:w-1/5 mb-2 sm:mb-0">
            <h4 className="font-semibold text-gray-600 text-lg">Updated At:</h4>
            <p className="font-medium text-gray-800">
              {new Date(order.updatedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
        <div className="flex flex-col mb-6">
          <h4 className="font-semibold text-gray-600 text-lg mb-2">
            Products:
          </h4>
          {order.products.map((product: any) => (
            <div key={product._id} className="flex flex-wrap sm:flex-row mb-2">
              <div className="sm:w-2/5 mb-2 sm:mb-0">
                <h5 className="font-semibold text-gray-600 text-md">
                  Product Name:
                </h5>
                <p className="font-medium text-gray-800">
                  {product.product.productName}
                </p>
              </div>
              <div className="sm:w-1/5 mb-2 sm:mb-0">
                <h5 className="font-semibold text-gray-600 text-md">
                  Quantity:
                </h5>
                <p className="font-medium text-gray-800">{product.quantity}</p>
              </div>
              <div className="sm:w-1/5 mb-2 sm:mb-0">
                <h5 className="font-semibold text-gray-600 text-md">Price:</h5>
                <p className="font-medium text-gray-800">{product.price}</p>
              </div>
              <div className="sm:w-1/5 mb-2 sm:mb-0">
                <h5 className="font-semibold text-gray-600 text-md">
                  Discounted Price:
                </h5>
                <p className="font-medium text-gray-800">
                  {product.discountedPrice}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
