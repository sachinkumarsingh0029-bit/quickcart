import React from "react";

const Features = () => {
  return (
    <section className="py-10 sm:py-16 lg:py-24 px-10 md:px-0 py-10 mx-auto bg-white shadow-md dark:bg-gray-900">
      <div className="container px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 text-center sm:grid-cols-2 gap-y-8 lg:grid-cols-4 sm:gap-12">
          <div>
            <div className="flex items-center justify-center w-20 h-20 mx-auto bg-blue-100 rounded-full">
              <svg
                className="text-blue-600 w-9 h-9"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                />
              </svg>
            </div>
            <h3 className="mt-8 text-lg font-semibold text-black dark:text-white">
              Secured Payments
            </h3>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
              Our marketplace ensures safe and secure payment transactions for
              both buyers and sellers.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-center w-20 h-20 mx-auto bg-orange-100 rounded-full">
              <svg
                className="text-orange-600 w-9 h-9"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="mt-8 text-lg font-semibold text-black dark:text-white">
              Fast & Easy to Load
            </h3>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
              Our platform is optimized for quick loading times, ensuring a
              seamless experience for users.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-center w-20 h-20 mx-auto bg-green-100 rounded-full">
              <svg
                className="text-green-600 w-9 h-9"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            </div>
            <h3 className="mt-8 text-lg font-semibold text-black dark:text-white">
              Light & Dark Version
            </h3>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
              Choose between our light and dark theme options to suit your
              personal preference and enhance your selling experience.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-center w-20 h-20 mx-auto bg-red-100 rounded-full">
              <svg
                className="text-red-600 w-9 h-9"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
            </div>
            <h3 className="mt-8 text-lg font-semibold text-black dark:text-white">
              Advanced Search Functionality
            </h3>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
              Our platform offers advanced search options, simplifying product
              discovery for buyers and sellers alike.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
