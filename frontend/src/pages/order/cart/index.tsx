import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addItem,
  clearCart,
  removeItem,
  updateQuantity,
} from "../../../redux/cart/cartSlice";
import { addItem as addWishListItem } from "../../../redux/wishlist/wishlistSlice";
import { useNavigate } from "react-router-dom";

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

interface wishlistItem {
  _id: string;
  productName: string;
  productDescription: string;
  discountedPrice: number;
  thumbnailUrl: string;
}

export const ShoppingCart = () => {
  // const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  const cartItems = useSelector((state: { cart: CartState }) => state.cart);
  const navigate = useNavigate();
  // const handleAddToCart = (product: CartItem) => {
  //   dispatch(addItem({ product, quantity }));
  // };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleIncreaseQuantity = (product: CartItem) => {
    dispatch(
      updateQuantity({ _id: product._id, quantity: product.quantity + 1 })
    );
  };

  const handleDecreaseQuantity = (product: CartItem) => {
    dispatch(
      updateQuantity({ _id: product._id, quantity: product.quantity - 1 })
    );
  };

  const handleSaveForLater = async (product: CartItem) => {
    const wishlistItem = {
      _id: product._id,
      productName: product.productName,
      discountedPrice:
        product.discountedPrice !== 0 ? product.discountedPrice : product.price,
      productDescription: product.productDescription,
      thumbnailUrl: product.thumbnailUrl,
    };
    dispatch(addWishListItem(wishlistItem));
    dispatch(removeItem(product));
  };

  const handleRemoveFromCart = (product: CartItem) => {
    dispatch(removeItem(product));
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900  dark:nx-bg-neutral-900">
      <div className="mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Shopping Cart
        </h1>
        <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <section
            aria-labelledby="cart-heading"
            className="lg:col-span-8 bg-white dark:bg-slate-600"
          >
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>

            <ul
              role="list"
              className="divide-y divide-gray-200 border-t border-b border-gray-200"
            >
              {cartItems.items.length !== 0 ? (
                cartItems.items.map((product) => (
                  <div key={product._id} className="px-4">
                    <li className="flex py-6 sm:py-6 ">
                      <div
                        className="flex-shrink-0 cursor-pointer"
                        onClick={() =>
                          navigate(`/product?query=${product._id}`)
                        }
                      >
                        <img
                          src={product.thumbnailUrl}
                          alt={product.productName}
                          className="h-24 w-24 rounded-md object-contain object-center sm:h-38 sm:w-38"
                        />
                      </div>

                      <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                          <div>
                            <div className="flex justify-between">
                              <h3 className="text-sm">
                                <a
                                  href="#"
                                  className="font-medium text-lg text-gray-700 dark:text-white"
                                >
                                  {product.productName}
                                </a>
                              </h3>
                            </div>
                            <div className="mt-1 flex text-sm">
                              <p
                                className="text-gray-500 dark:text-gray-200"
                                style={{
                                  display: "-webkit-box",
                                  WebkitLineClamp: 3,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                }}
                              >
                                {product.productDescription}
                              </p>
                            </div>
                            {product.discountedPrice !== 0 ? (
                              <div className="mt-1 flex items-end">
                                <p className="text-xs line-through font-medium text-gray-500 dark:text-gray-100">
                                  ₹{product.price}
                                </p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  &nbsp;&nbsp;₹{product.discountedPrice}
                                </p>
                                &nbsp;&nbsp;
                                <p className="text-sm font-medium text-green-500">
                                  ₹{product.price - product.discountedPrice}
                                </p>
                              </div>
                            ) : (
                              <div className="mt-1 flex items-end">
                                <p className="text-xs line-through font-medium text-gray-500 dark:text-gray-100">
                                  ₹{product.price}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                    <div className="flex mb-2">
                      <div className="flex min-w-24 dark:text-white">
                        <button
                          type="button"
                          className="h-7 w-7 rounded-full border border-[#e0e0e0]"
                          onClick={() => handleDecreaseQuantity(product)}
                        >
                          -
                        </button>
                        <input
                          type="text"
                          className="h-7 w-9 text-center mx-1 border dark:bg-white dark:text-black"
                          value={product.quantity}
                          disabled
                        />
                        <button
                          type="button"
                          className="h-7 w-7 rounded-full border border-[#e0e0e0] flex justify-center items-center"
                          onClick={() => handleIncreaseQuantity(product)}
                        >
                          +
                        </button>
                      </div>
                      <div className="ml-4 flex flex-1 sm:ml-6 dark:text-white">
                        <button
                          className="font-medium mr-4"
                          onClick={() => handleSaveForLater(product)}
                        >
                          SAVE FOR LATTER
                        </button>
                        <button
                          className="font-medium"
                          onClick={() => handleRemoveFromCart(product)}
                        >
                          REMOVE
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 flex flex-col px-4 py-6 sm:py-6">
                  <p className="text-xl font-semibold mb-4">No items found</p>
                  <p className="text-gray-500 mb-4">
                    Add items to your Cart and shop later!
                  </p>
                  <button
                    className="px-4 py-2 bg-indigo-500 text-white rounded-md shadow-md hover:bg-indigo-600 transition duration-200"
                    onClick={() => {
                      navigate("/shop");
                    }}
                  >
                    Shop now
                  </button>
                </div>
              )}
            </ul>
          </section>

          {/* Order summary */}
          <section
            aria-labelledby="summary-heading"
            className="mt-16 rounded-md bg-white dark:bg-slate-600 lg:col-span-4 lg:mt-0 lg:p-0"
          >
            <h2
              id="summary-heading"
              className=" px-4 py-3 sm:p-4 border-b border-gray-200 text-lg font-medium text-gray-900 dark:text-gray-200"
            >
              Price Details
            </h2>

            <div>
              <dl className=" space-y-1  px-6 py-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-800 dark:text-gray-200">
                    Price ({cartItems.totalQuantity} item)
                  </dt>
                  <dd className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    ₹{cartItems.totalPrice}
                  </dd>
                </div>
                <div className="flex items-center justify-between pt-4">
                  <dt className="flex items-center text-sm text-gray-800 dark:text-gray-200">
                    <span>Discount</span>
                  </dt>
                  <dd className="text-sm font-medium text-green-700 dark:text-green-400">
                    - ₹{cartItems.totalDiscount}
                  </dd>
                </div>
                <div className="flex items-center justify-between py-4">
                  <dt className="flex text-sm text-gray-800 dark:text-gray-200">
                    <span>Delivery Charges</span>
                  </dt>
                  <dd className="text-sm font-medium text-green-700 dark:text-green-400">
                    Free
                  </dd>
                </div>
                <div className="flex items-center justify-between py-4 border-y border-dashed">
                  <dt className="text-base font-medium text-gray-900 dark:text-white">
                    Total Amount
                  </dt>
                  <dd className="text-base font-medium text-gray-900 dark:text-white">
                    ₹{cartItems.totalAmount}
                  </dd>
                </div>
              </dl>
              <div className="px-6 pb-4 font-medium text-green-700 dark:text-green-400">
                You will save ₹ {cartItems.totalDiscount} on this order
              </div>
              <div className="flex items-center justify-between border-y">
                <button
                  type="button"
                  className={`inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full
                  ${
                    cartItems.items.length <= 0
                      ? "bg-indigo-400 hover:bg-indigo-400"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                  onClick={() => navigate("/checkout")}
                  disabled={cartItems.items.length <= 0}
                >
                  Checkout
                </button>
              </div>
            </div>
          </section>
        </form>
      </div>
    </div>
  );
};
