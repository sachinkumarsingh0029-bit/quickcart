import React from "react";

const About = () => {
  return (
    <section className="py-10 sm:py-16 lg:py-24 bg-white shadow-md dark:bg-gray-900 dark:text-white">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-sm font-semibold tracking-widest text-indigo-600 uppercase">
            About Our Marketplace
          </p>

          <h2 className="mt-6 text-2xl font-bold leading-tight text-black dark:text-white sm:text-3xl lg:text-4xl">
            Connecting Buyers and Sellers
            <span className="block text-lg text-gray-600">for Success</span>
          </h2>
        </div>

        <div className="grid items-center grid-cols-1 mt-12 gap-y-10 lg:grid-cols-5 sm:mt-20 gap-x-4">
          <div className="space-y-8 lg:pr-16 xl:pr-24 lg:col-span-2 lg:space-y-12">
            <div className="flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-12 h-12"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75"
                />
              </svg>

              <div className="ml-5">
                <h3 className="text-xl font-semibold text-black dark:text-white">
                  Wide Range of High-Quality Products
                </h3>
                <p className="mt-3 text-base text-gray-600 dark:text-gray-300">
                  Our marketplace offers diverse and quality products from
                  reputable sellers committed to honesty, transparency, and
                  exceptional service.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-12 h-12"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z"
                />
              </svg>

              <div className="ml-5">
                <h3 className="text-xl font-semibold text-black dark:text-white">
                  User-Friendly Platform
                </h3>
                <p className="mt-3 text-base text-gray-600 dark:text-gray-300">
                  Our platform is designed to simplify buying and selling in
                  bulk. It has intuitive search functions, easy-to-use filters,
                  and a streamlined checkout process.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-12 h-12"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>

              <div className="ml-5">
                <h3 className="text-xl font-semibold text-black dark:text-white">
                  Trusted and Secure
                </h3>
                <p className="mt-3 text-base text-gray-600 dark:text-gray-300">
                  We prioritize trust and security. Our encryption technology
                  safeguards transactions and sensitive info. Our rating system
                  promotes transparency and informed decision-making.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <img
              className="w-full rounded-lg shadow-xl"
              src="https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mjh8fGRlc2lnbnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60"
              alt=""
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
