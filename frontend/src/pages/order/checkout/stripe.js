import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  CardElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { CreateToast } from "../../../utils/Toast";
import { placeOrderApi, updateTransaction } from "../../../api/order";
import { useDispatch } from "react-redux";
import { clearCart } from "../../../redux/cart/cartSlice";
import { BeatLoader } from "react-spinners";

const Stripe = ({ options }) => {
  const cartItems = useSelector((state) => state.cart);
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const { state } = useLocation();
  const { transactionId } = useParams();
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const cardNumber = elements.getElement('card');

    const isInvalid = cardNumber._invalid;
    const isEmpty = cardNumber._empty;

    if (!stripe || !elements || isInvalid || isEmpty) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      CreateToast('invalidinput', 'Invalid details', 'error');
      return;
    }

    if (!state.address || !state.number || !state.fullname) {
      navigate('/cart')
      CreateToast('paymenterror', "Something went wrong...", 'error');
    }

    setLoading(true)

    const result = await stripe
      .confirmCardPayment(options.clientSecret, {
        payment_method: {
          card: elements.getElement('card'),
          billing_details: {
            name: state.fullname,
          },
        },
      })
    console.log(result)
    if (result.error) {
      CreateToast('paymenterror', result.error.message, 'error');
      navigate('/cart')
      return;
    }
    if (result?.paymentIntent?.status === "succeeded") {
      await updateTransaction(transactionId);
      const products = cartItems.items.map((item) => ({
        id: item._id,
        quantity: item.quantity,
      }));

      const { cart_id } = await placeOrderApi({
        shippingAddress: state.address,
        number: state.number,
        fullname: state.fullname,
        products: products,
        transactionId: transactionId,
      });
      navigate(`/orders`, { replace: true })
      dispatch(clearCart())
      CreateToast('payment', 'Payment Successful', 'success');
    }

    setLoading(false)
  };

  return (
    <>
      <div className="relative mx-auto w-full bg-white">
        <div className="grid min-h-screen grid-cols-10">
          <div className="col-span-full py-6 px-4 sm:py-12 lg:col-span-6 lg:py-24">
            <div className="mx-auto w-full max-w-lg">
              <h1 className="relative text-2xl font-medium text-gray-700 sm:text-3xl">
                Secure Checkout
                <span className="mt-2 block h-1 w-10 bg-teal-600 sm:w-20"></span>
              </h1>
              <form className="mt-10 flex flex-col space-y-4">
                <CardElement id="card" />
                <p className="mt-10 text-center text-sm font-semibold text-gray-500">
                  By placing this order you agree to the{" "}
                  <span
                    onClick={() => navigate("/termsandconditions")}
                    className="cursor-pointer whitespace-nowrap text-teal-400 underline hover:text-teal-600"
                  >
                    Terms and Conditions
                  </span>
                </p>
                <button
                  type="submit"
                  className="mt-4 inline-flex w-full items-center justify-center rounded bg-teal-600 py-2.5 px-4 text-base font-semibold tracking-wide text-white text-opacity-80 outline-none ring-offset-2 transition hover:text-opacity-100 focus:ring-2 focus:ring-teal-500 sm:text-lg"
                  onClick={(e) => handleSubmit(e)}
                  disabled={loading}
                >
                  {!loading ? "Place Order" : <BeatLoader color="#fff" />}

                </button>
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
    </>
  );
};

export default Stripe;
