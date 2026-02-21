import React from "react";

type PricingProps = {
  isOpen: boolean;
  openModal: () => void;
};

const Pricing = ({ isOpen, openModal }: PricingProps) => {
  return (
    <div className="bg-white dark:bg-gray-900" id="registrationmodel">
      <div className="container px-6 py-8 mx-auto">
        <h1 className="text-2xl font-semibold text-center text-gray-800 capitalize lg:text-3xl dark:text-white">
          Pricing Plan
        </h1>

        <p className="max-w-2xl mx-auto mt-4 text-center text-gray-500 xl:mt-6 dark:text-gray-300">
          We offer a free pricing plan that includes all the features you need
          to get started.
        </p>

        <div className="grid grid-cols-1 gap-8 mt-6 xl:mt-12 xl:gap-12 md:grid-cols-1 lg:grid-cols-1">
          <div className="col-span-1 w-full p-8 space-y-8 text-center border border-gray-200 rounded-lg dark:border-gray-700">
            <p className="font-medium text-gray-500 uppercase dark:text-gray-300">
              Free
            </p>

            <h2 className="text-4xl font-semibold text-gray-800 uppercase dark:text-gray-100">
              ₹0
            </h2>

            <p className="font-medium text-gray-500 dark:text-gray-300">
              Lifetime
            </p>

            <button
              className="w-full px-4 py-2 mt-10 tracking-wide text-white capitalize transition-colors duration-300 transform bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-80"
              onClick={() => {
                !isOpen && openModal();
              }}
            >
              Start Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
