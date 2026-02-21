import React from "react";
import GlimpseCart from "./GlimpseCart";

const GlimpseWishlist = () => {
  return (
    <div className="flex flex-col lg:flex-row">
      <GlimpseCart />
      <div className="px-4 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto mt-10">
        <div className="flex flex-col justify-start items-start bg-gray-50 px-4 py-4 md:py-6 md:p-6 xl:p-8 w-full">
          <h1 className="text-3xl lg:text-4xl font-semibold leading-7 lg:leading-9  text-gray-800">
            Wishlist
          </h1>
          <div className="mt-4 md:mt-6 flex flex-col md:flex-row justify-start items-start md:items-center md:space-x-6 xl:space-x-8 w-full">
            <div className="pb-4 md:pb-8 w-full md:w-40">
              <img
                className="w-full hidden md:block"
                src="https://i.ibb.co/84qQR4p/Rectangle-10.png"
                alt="dress"
              />
              <img
                className="w-full md:hidden"
                src="https://i.ibb.co/L039qbN/Rectangle-10.png"
                alt="dress"
              />
            </div>
            <div className="border-b border-gray-200 md:flex-row flex-col flex justify-between items-start w-full  pb-8 space-y-4 md:space-y-0">
              <div className="w-full flex flex-col justify-start items-start space-y-8">
                <h3 className="text-xl xl:text-2xl font-semibold leading-6 text-gray-800">
                  Premium Quaility Dress
                </h3>
                <div className="flex justify-start items-start flex-col space-y-2">
                  <p className="text-sm leading-none text-gray-800">
                    <span className="text-gray-300">Style: </span> Italic
                    Minimal Design
                  </p>
                  <p className="text-sm leading-none text-gray-800">
                    <span className="text-gray-300">Size: </span> Small
                  </p>
                  <p className="text-sm leading-none text-gray-800">
                    <span className="text-gray-300">Color: </span> Light Blue
                  </p>
                </div>
              </div>
              <div className="flex justify-between space-x-8 items-start w-full">
                <p className="text-base xl:text-lg leading-6">
                  $36.00{" "}
                  <span className="text-red-300 line-through"> $45.00</span>
                </p>
                <p className="text-base xl:text-lg leading-6 text-gray-800">
                  01
                </p>
                <p className="text-base xl:text-lg font-semibold leading-6 text-gray-800">
                  $36.00
                </p>
              </div>
            </div>
          </div>
          <div className="mt-6 md:mt-0 flex justify-start flex-col md:flex-row  items-start md:items-center space-y-4  md:space-x-6 xl:space-x-8 w-full ">
            <div className="w-full md:w-40">
              <img
                className="w-full hidden md:block"
                src="https://i.ibb.co/s6snNx0/Rectangle-17.png"
                alt="dress"
              />
              <img
                className="w-full md:hidden"
                src="https://i.ibb.co/BwYWJbJ/Rectangle-10.png"
                alt="dress"
              />
            </div>
            <div className="  flex justify-between items-start w-full flex-col md:flex-row space-y-4 md:space-y-0  ">
              <div className="w-full flex flex-col justify-start items-start space-y-8">
                <h3 className="text-xl xl:text-2xl font-semibold leading-6 text-gray-800">
                  High Quaility Italic Dress
                </h3>
                <div className="flex justify-start items-start flex-col space-y-2">
                  <p className="text-sm leading-none text-gray-800">
                    <span className="text-gray-300">Style: </span> Italic
                    Minimal Design
                  </p>
                  <p className="text-sm leading-none text-gray-800">
                    <span className="text-gray-300">Size: </span> Small
                  </p>
                  <p className="text-sm leading-none text-gray-800">
                    <span className="text-gray-300">Color: </span> Light Blue
                  </p>
                </div>
              </div>
              <div className="flex justify-between space-x-8 items-start w-full">
                <p className="text-base xl:text-lg leading-6">
                  $20.00{" "}
                  <span className="text-red-300 line-through"> $30.00</span>
                </p>
                <p className="text-base xl:text-lg leading-6 text-gray-800">
                  01
                </p>
                <p className="text-base xl:text-lg font-semibold leading-6 text-gray-800">
                  $20.00
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlimpseWishlist;
