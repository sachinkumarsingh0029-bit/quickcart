import React from "react";
import { useParams } from "react-router-dom";

export const OrderConfirmed = () => {
  const { cart_id } = useParams();
  console.log(cart_id);
  return (
    <div className="max-w-4xl mx-auto my-4 md:my-6">
      <div className="overflow-hidden border border-gray-100  shadow rounded-xl">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product List */}
          <div className="px-5 py-6 dark:bg-gray-800 md:border-r-gray-200 md:border-r md:px-8">
            <div className="flow-root">
              <ul className="divide-y divide-gray-200 -my-7">
                {products.map((product) => (
                  <li
                    key={product.id}
                    className="flex items-stretch justify-between space-x-5 py-7"
                  >
                    <div className="flex items-stretch flex-1">
                      <div className="flex-shrink-0">
                        <img
                          className="w-20 h-20 border border-gray-200 rounded-lg object-contain"
                          src={product.imageSrc}
                          alt={product.imageSrc}
                        />
                      </div>

                      <div className="flex flex-col justify-between ml-5">
                        <div className="flex-1">
                          <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                            {product.name}
                          </p>
                          <p className="mt-1.5 text-sm font-medium text-gray-500 dark:text-gray-300">
                            {product.color}
                          </p>
                        </div>

                        <p className="mt-4 text-sm font-medium text-gray-500 dark:text-gray-300">
                          x {product.quantity}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-between ml-auto">
                      <p className="text-sm font-bold text-right text-gray-900 dark:text-white">
                        {product.price}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <hr className="mt-6 border-gray-200" />
              <ul className="mt-6 space-y-3">
                <li className="flex items-center justify-between text-gray-600 dark:text-gray-200">
                  <p className="text-sm font-medium ">Sub total</p>
                  <p className="text-sm font-medium">₹1,14,399</p>
                </li>

                <li className="flex items-center justify-between text-gray-900 dark:text-white">
                  <p className="text-sm font-medium ">Total</p>
                  <p className="text-sm font-bold ">₹1,14,399</p>
                </li>
              </ul>
            </div>
          </div>
          {/* Contact Info */}
          <div className="px-5 py-6 dark:bg-gray-900  md:px-8">
            <div className="flow-root">
              <div className="-my-6 divide-y divide-gray-200">
                <div className="py-6">
                  <h2 className="font-bold text-gray-900 dark:text-white text-base">
                    Contact Information
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 font-light">
                    Order Number: #9876567890
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 font-light">
                    {" "}
                    Date: March 03, 2023
                  </p>
                  <button className="mt-3 rounded-md bg-gray-600 px-3.5 py-1.5 text-base font-semibold leading-7 text-white hover:bg-gray-500">
                    View Invoice
                  </button>
                </div>

                <div className="py-6">
                  <h2 className="font-bold text-gray-900 dark:text-white text-base mb-2">
                    Shipping Information
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 font-light">
                    Lem Deluce
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 font-light">
                    1 Ronald Regan Court
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 font-light">
                    102-655-3689
                  </p>
                </div>

                <div className="py-6">
                  <h2 className="font-bold text-gray-900 dark:text-white text-base">
                    Payment Information
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 font-light">
                    **** **** **** 6202
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 font-light">
                    Expires 09/25
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const products = [
  {
    id: 1,
    name: "APPLE iPhone 13 (Midnight, 128 GB)",
    imageSrc:
      "https://dev-ui-image-assets.s3.ap-south-1.amazonaws.com/order-confirmed/iphone-13-mlpf3hn-a-apple-original-imag6vzz5qvejz8z.jpeg?q=70",
    href: "#",
    price: "₹61,999",
    color: "Midnight",
    imageAlt: "APPLE iPhone 13 (Midnight, 128 GB)",
    quantity: 1,
  },
  {
    id: 2,
    name: "APPLE Airpods Pro with MagSafe Charging Case Bluetooth Headset",
    imageSrc:
      "https://dev-ui-image-assets.s3.ap-south-1.amazonaws.com/order-confirmed/mwp22hn-a-apple-original-imag3qe9eqkfhmg8.jpeg?q=70",
    href: "#",
    price: "₹22,500",
    color: "White, True Wireless",
    imageAlt: "APPLE Airpods Pro with MagSafe Charging Case Bluetooth Headset",
    quantity: 1,
  },
  {
    id: 3,
    name: "APPLE iPad (9th Gen) 64 GB ROM 10.2 inch with Wi-Fi Only",
    imageSrc:
      "https://dev-ui-image-assets.s3.ap-south-1.amazonaws.com/order-confirmed/mk2k3hn-a-apple-original-imag6yy7xjjugz4w.jpeg?q=70",
    href: "#",
    price: "₹29,900",
    color: "Space Grey",
    imageAlt: "APPLE iPad (9th Gen) 64 GB ROM 10.2 inch with Wi-Fi Only",
    quantity: 1,
  },
  // More products...
];
