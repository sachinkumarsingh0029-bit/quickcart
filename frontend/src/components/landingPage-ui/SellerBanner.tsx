import React from "react";
import { useNavigate } from "react-router-dom";

function SellerBanner() {
  const navigate = useNavigate();
  return (
    <section className="bg-gray-100 dark:bg-gray-800 lg:py-12 lg:flex lg:justify-center">
      <div className="overflow-hidden bg-white dark:bg-gray-900 lg:mx-8 lg:flex lg:max-w-6xl lg:w-full lg:shadow-md lg:rounded-xl">
        <div className="lg:w-1/2">
          <div
            className="h-64 bg-cover lg:h-full"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80')`,
            }}
          ></div>
        </div>

        <div className="max-w-xl px-6 py-12 lg:max-w-5xl lg:w-1/2">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white md:text-3xl">
            Sell in bulk for <span className="text-blue-500">free</span>
          </h2>

          <p className="mt-4 text-gray-500 dark:text-gray-300">
            With QuickCart, you can reach a wider audience and sell your
            products in bulk without worrying about platform fees. Sign up now
            and start boosting your sales with our secure, seamless platform.
            Plus, with integrated blockchain and PayPal payment options and our
            intuitive dashboard feature, selling in bulk has never been easier.
          </p>

          <div className="inline-flex w-full mt-6 sm:w-auto">
            <a
              href="#"
              className="inline-flex items-center justify-center w-full px-6 py-2 text-sm text-white duration-300 bg-gray-800 rounded-lg hover:bg-gray-700 focus:ring focus:ring-gray-300 focus:ring-opacity-80 dark:text-black dark:bg-white"
              onClick={() => navigate("/applyforseller")}
            >
              Become Seller
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SellerBanner;
