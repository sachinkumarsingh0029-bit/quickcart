import React from "react";

const SellerFaq = () => {
  return (
    <section className="py-10 sm:py-16 lg:py-24 mx-auto px-10 md:px-0 py-10 bg-white shadow-md dark:bg-gray-900 dark:text-white">
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div className="max-w-2xl mx-auto lg:text-center">
          <h2 className="text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl lg:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="max-w-xl lg:mx-auto mt-4 text-base leading-relaxed text-gray-600">
            Here are some common questions and answers about our services.
          </p>
        </div>
        <div className="max-w-3xl mx-auto mt-8 md:mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="font-semibold text-xl text-black dark:text-white">
              How do I get started?
            </h2>
            <p className="text-sm leading-6 tracking-wide text-gray-500 mt-6">
              To get started, simply sign up for our free plan and create an
              account. You can then start creating and publishing your listings.
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-xl text-black dark:text-white">
              What payment options do you offer?
            </h2>
            <p className="text-sm leading-6 tracking-wide text-gray-500 mt-6">
              We offer a variety of payment options including credit/debit
              cards, PayPal, and bank transfers.
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-xl text-black dark:text-white">
              How do I edit my listings?
            </h2>
            <p className="text-sm leading-6 tracking-wide text-gray-500 mt-6">
              To edit a listing, simply log in to your account and go to the "My
              Listings" section. From there, you can edit and update your
              listings as needed.
            </p>
          </div>
          <div>
            <h2 className="font-semibold text-xl text-black dark:text-white">
              How do I cancel my subscription?
            </h2>
            <p className="text-sm leading-6 tracking-wide text-gray-500 mt-6">
              To cancel your subscription, simply log in to your account and go
              to the "Billing" section. From there, you can cancel your
              subscription at any time.
            </p>
          </div>
        </div>
        <p className="text-center text-gray-600 textbase mt-10">
          Still have questions?{" "}
          <a
            href="mailto:QuickCart@gmail.com"
            title=""
            className="font-medium text-indigo-600 hover:underline"
          >
            Contact us
          </a>
        </p>
      </div>
    </section>
  );
};

export default SellerFaq;
