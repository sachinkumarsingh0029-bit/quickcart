import React, { useRef } from "react";

const Hero = () => {
  const handleOnClick = () => {
    if (window.location.hash === "#registrationmodel") {
      window.location.hash = "";
      window.location.hash = "#registrationmodel";
    } else {
      window.location.hash = "#registrationmodel";
    }
  };
  // return (
  //   // <section className="dark:bg-gray-900 dark:text-gray-100">
  //   //   <div className="container flex flex-row justify-center p-24 mx-auto sm:py-12 lg:py-24 lg:flex-row lg:justify-between">
  //   //     <div className="flex flex-col justify-center p-6 text-center rounded-sm lg:max-w-md xl:max-w-lg lg:text-left">
  //   //       <h1 className="text-5xl font-bold leading-none sm:text-6xl">
  //   //         Join Our
  //   //         <span className="dark:text-violet-400"> Marketplace</span> <br />
  //   //         as seller
  //   //       </h1>
  //   //       <p className="mt-6 mb-8 text-lg sm:mb-12">
  //   //         Start Selling Your Products in Bulk Today and Reach a Wider Audience
  //   //       </p>
  //   //     </div>
  //   //     <div className="flex items-center justify-center w-full mt-6 lg:mt-0 lg:w-1/2">
  //   //       <img
  //   //         src={businessSvg}
  //   //         alt=""
  //   //         className="object-contain h-72 sm:h-80 lg:h-96 xl:h-112 2xl:h-128"
  //   //       />
  //   //     </div>
  //   //   </div>
  //   // </section>
  // );
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="container px-6 py-16 mx-auto text-center">
        <div className="max-w-lg mx-auto">
          <h1 className="text-3xl font-semibold text-gray-800 dark:text-white lg:text-4xl">
            Join Our Marketplace as seller
          </h1>
          <p className="mt-6 text-gray-500 dark:text-gray-300">
            Start Selling Your Products in Bulk Today and Reach a Wider Audience
          </p>
          <button
            onClick={handleOnClick}
            className="px-5 py-2 mt-6 text-sm font-medium leading-5 text-center text-white capitalize bg-blue-600 rounded-lg hover:bg-blue-500 lg:mx-0 lg:w-auto focus:outline-none"
          >
            Start Selling
          </button>
          <p className="mt-3 text-sm text-gray-400">
            start selling now for zero marketplace fees!
          </p>
        </div>

        <div className="flex justify-center mt-10">
          <img
            className="object-cover w-full h-96 rounded-xl lg:w-"
            src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
