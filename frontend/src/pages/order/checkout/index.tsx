import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import instance from "../../../utils/Axios";
import { FaBitcoin, FaCreditCard } from "react-icons/fa";
import { useState } from "react";
import { useFormik } from "formik";
import { checkoutSchema } from "../../../schemas";
import { createTransaction } from "../../../api/order";
import { CreateToast } from "../../../utils/Toast";

interface CartItem {
  _id: string;
  productName: string;
  price: number;
  discountedPrice: number;
  productDescription: "";
  thumbnailUrl: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalAmount: number;
  totalDiscount: number;
  totalPrice: number;
  totalQuantity: number;
}

const initialValues = {
  address: "",
  number: "",
  fullname: "",
};

const Checkout = () => {
  const cartItems = useSelector((state: { cart: CartState }) => state.cart);
  const navigate = useNavigate();

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setTouched,
    isValid,
  } = useFormik({
    initialValues,
    validationSchema: checkoutSchema,
    onSubmit: async (values, action) => {},
  });

  const handleBlockchainPayment = async () => {
    if (
      !isValid ||
      (Object.keys(touched).length === 0 && touched.constructor === Object)
    ) {
      setTouched(touched);
      return;
    } else {
      try {
        const data = {
          type: "purchase",
          amount: cartItems.totalAmount,
          paymentMethod: "blockchain",
        };
        const result = await createTransaction(data);
        console.log(result.transaction.trans_id);
        if (result.transaction.trans_id) {
          navigate(`/order/checkout/metamask/${result.transaction.trans_id}`, {
            state: {
              address: values.address,
              number: values.number,
              fullname: values.fullname,
            },
            replace: true,
          });
        }
      } catch (error) {
        CreateToast("tryagain", "Try again after sometime", "error");
      }
    }
  };

  const handleStripePayment = async () => {
    if (
      !isValid ||
      (Object.keys(touched).length === 0 && touched.constructor === Object)
    ) {
      setTouched(touched);
      return;
    } else {
      try {
        const data = {
          type: "purchase",
          amount: cartItems.totalAmount,
          paymentMethod: "stripe",
        };
        const result = await createTransaction(data);
        if (result.transaction.trans_id) {
          navigate(`/order/checkout/stripe/${result.transaction.trans_id}`, {
            state: {
              address: values.address,
              number: values.number,
              fullname: values.fullname,
            },
            replace: true,
          });
        }
      } catch (error) {}
    }
  };

  return cartItems.items.length > 0 ? (
    <div className="relative mx-auto w-full bg-white">
      <div className="grid min-h-screen grid-cols-10">
        <div className="col-span-full py-6 px-4 sm:py-12 lg:col-span-6 lg:py-24">
          <div className="mx-auto w-full max-w-lg">
            <h1 className="relative text-2xl font-medium text-gray-700 sm:text-3xl">
              Secure Checkout
              <span className="mt-2 block h-1 w-10 bg-teal-600 sm:w-20"></span>
            </h1>
            <form
              className="mt-10 flex flex-col space-y-4"
              onSubmit={handleSubmit}
            >
              <div>
                <label
                  htmlFor="fullname"
                  className="text-xs font-semibold text-gray-500"
                >
                  Full Name{" "}
                  {errors.fullname && touched.fullname ? (
                    <span className="text-red-500 text-sm font-sm">
                      ({errors.fullname})
                    </span>
                  ) : (
                    <span className="text-red-500 text-sm font-sm">*</span>
                  )}
                </label>
                <input
                  type="text"
                  name="fullname"
                  value={values.fullname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="John Marik"
                  className="mt-1 block w-full rounded border-gray-300 bg-teal-1000 py-3 px-4 text-sm placeholder-gray-300 shadow-sm outline-none transition focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label
                  htmlFor="number"
                  className="text-xs font-semibold text-gray-500"
                >
                  Number{" "}
                  {errors.number && touched.number ? (
                    <span className="text-red-500 text-sm font-sm">
                      ({errors.number})
                    </span>
                  ) : (
                    <span className="text-red-500 text-sm font-sm">*</span>
                  )}
                </label>
                <input
                  type="text"
                  name="number"
                  value={values.number}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="1234567890"
                  className="mt-1 block w-full rounded border-gray-300 bg-teal-1000 py-3 px-4 text-sm placeholder-gray-300 shadow-sm outline-none transition focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label
                  htmlFor="address"
                  className="text-xs font-semibold text-gray-500"
                >
                  Address{" "}
                  {errors.address && touched.address ? (
                    <span className="text-red-500 text-sm font-sm">
                      ({errors.address})
                    </span>
                  ) : (
                    <span className="text-red-500 text-sm font-sm">*</span>
                  )}
                </label>
                <input
                  type="address"
                  name="address"
                  value={values.address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="123 Main St Apt 4B New York, NY 10001"
                  className="mt-1 block w-full rounded border-gray-300 bg-teal-1000 py-3 px-4 text-sm placeholder-gray-300 shadow-sm outline-none transition focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="mr-4 w-full mt-4 inline-flex items-center justify-center rounded bg-teal-600 py-2.5 px-4 text-base font-semibold tracking-wide text-white text-opacity-80 outline-none ring-offset-2 transition hover:text-opacity-100 focus:ring-2 focus:ring-teal-500 sm:text-lg"
                  onClick={handleBlockchainPayment}
                >
                  <FaBitcoin className="mr-2" />
                  Pay with Blockchain
                </button>
                <button
                  type="submit"
                  onClick={handleStripePayment}
                  className="w-full mt-4 inline-flex items-center justify-center rounded bg-blue-500 py-2.5 px-4 text-base font-semibold tracking-wide text-white text-opacity-80 outline-none ring-offset-2 transition hover:text-opacity-100 focus:ring-2 focus:ring-blue-500 sm:text-lg"
                >
                  <FaCreditCard className="mr-2" />
                  Pay with Stripe
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="relative col-span-full flex flex-col py-6 pl-8 pr-4 sm:py-12 lg:col-span-4 lg:py-24">
          <h2 className="sr-only">Order summary</h2>
          <div>
            <img
              src="https://images.unsplash.com/photo-1581318694548-0fb6e47fe59b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80"
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 h-full w-full bg-gradient-to-t from-teal-800 to-teal-400 opacity-95"></div>
          </div>
          <div className="relative">
            <ul className="space-y-5">
              {cartItems.items.length !== 0 ? (
                cartItems.items.map((product) => (
                  <li className="flex justify-between">
                    <div className="inline-flex">
                      <img
                        src={product.thumbnailUrl}
                        alt={product.productName}
                        className="max-h-16"
                      />
                      <div className="ml-3">
                        <p className="text-base font-semibold text-white">
                          {product.productName}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-white">
                      ₹{product.price}
                    </p>
                  </li>
                ))
              ) : (
                <></>
              )}
            </ul>
            <div className="my-5 h-0.5 w-full bg-white bg-opacity-30"></div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-white dark:text-gray-200">
                  Price ({cartItems.totalQuantity} item)
                </dt>
                <dd className="text-sm font-medium text-white dark:text-gray-100">
                  ₹{cartItems.totalPrice}
                </dd>
              </div>
              <div className="flex items-center justify-between pt-4">
                <dt className="flex items-center text-sm text-white dark:text-gray-200">
                  <span>Discount</span>
                </dt>
                <dd className="text-sm font-medium text-white dark:text-green-400">
                  - ₹{cartItems.totalDiscount}
                </dd>
              </div>
              <div className="flex items-center justify-between py-4 border-y border-dashed">
                <dt className="text-base font-medium text-white dark:text-white">
                  Total Amount
                </dt>
                <dd className="text-base font-medium text-white dark:text-white">
                  ₹{cartItems.totalAmount}
                </dd>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Navigate to="/shop" />
  );
};

export default Checkout;
