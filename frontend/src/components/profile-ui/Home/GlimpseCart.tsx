import React from "react";

const GlimpseCart = () => {
  return (
    <div className="px-4 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto mt-10">
      <div
        className="lg:w-screen max-w-sm border border-gray-600 bg-gray-100 p-4 pt-4 sm:p-6 lg:p-8"
        aria-modal="true"
        role="dialog"
      >
        <div className="mt-6 space-y-6">
          <ul className="space-y-4">
            <li className="flex items-center gap-4">
              <img
                src="https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=830&q=80"
                alt=""
                className="h-16 w-16 rounded object-cover"
              />

              <div>
                <h3 className="text-sm text-gray-900">Basic Tee 6-Pack</h3>

                <dl className="mt-0.5 space-y-px text-[10px] text-gray-600">
                  <div>
                    <dt className="inline">Size:</dt>
                    <dd className="inline">XXS</dd>
                  </div>

                  <div>
                    <dt className="inline">Color:</dt>
                    <dd className="inline">White</dd>
                  </div>
                </dl>
              </div>
            </li>

            <li className="flex items-center gap-4">
              <img
                src="https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=830&q=80"
                alt=""
                className="h-16 w-16 rounded object-cover"
              />

              <div>
                <h3 className="text-sm text-gray-900">Basic Tee 6-Pack</h3>

                <dl className="mt-0.5 space-y-px text-[10px] text-gray-600">
                  <div>
                    <dt className="inline">Size:</dt>
                    <dd className="inline">XXS</dd>
                  </div>

                  <div>
                    <dt className="inline">Color:</dt>
                    <dd className="inline">White</dd>
                  </div>
                </dl>
              </div>
            </li>

            <li className="flex items-center gap-4">
              <img
                src="https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=830&q=80"
                alt=""
                className="h-16 w-16 rounded object-cover"
              />

              <div>
                <h3 className="text-sm text-gray-900">Basic Tee 6-Pack</h3>

                <dl className="mt-0.5 space-y-px text-[10px] text-gray-600">
                  <div>
                    <dt className="inline">Size:</dt>
                    <dd className="inline">XXS</dd>
                  </div>

                  <div>
                    <dt className="inline">Color:</dt>
                    <dd className="inline">White</dd>
                  </div>
                </dl>
              </div>
            </li>
          </ul>

          <div className="space-y-4 text-center">
            <a
              href="#"
              className="block rounded border border-gray-600 px-5 py-3 text-sm text-gray-600 transition hover:ring-1 hover:ring-gray-400"
            >
              View my cart (2)
            </a>

            <a
              href="#"
              className="block rounded bg-gray-700 px-5 py-3 text-sm text-gray-100 transition hover:bg-gray-600"
            >
              Checkout
            </a>

            <a
              href="#"
              className="inline-block text-sm text-gray-500 underline underline-offset-4 transition hover:text-gray-600"
            >
              Continue shopping
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlimpseCart;
