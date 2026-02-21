import React, { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Stripe from "./stripe";
import instance from "../../../utils/Axios";
import { useSelector } from "react-redux";
import FullPageLoading from "../../loading/FullPageLoading";

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

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  "pk_test_51HTOQGCH0xfOm9H9DFKqF6UPfpNDZ3NEuZVsHNHPp4nRvN2xC4yE6Rop9fLQj17AUccWTj3lsV8gr0ghLtEzGShJ00XAZJ0Xag"
);

const StripeLayout = () => {
  const cartItems = useSelector((state: { cart: CartState }) => state.cart);
  const [clientSecret, setClientSecret] = useState("");
  const options = {
    clientSecret: clientSecret,
  };
  useEffect(() => {
    async function fetchClientSecret() {
      try {
        const res = await instance.post("payment/intent", {
          amount: cartItems.totalAmount,
        });
        setClientSecret(res?.data.client_secret);
      } catch (error) {}
    }
    if (!clientSecret) {
      fetchClientSecret();
    }
  }, []);
  return (
    <>
      {clientSecret ? (
        <Elements stripe={stripePromise} options={options}>
          <Stripe options={options} />
        </Elements>
      ) : (
        <FullPageLoading />
      )}
    </>
  );
};

export default StripeLayout;
