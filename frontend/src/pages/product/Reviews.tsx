import React from "react";
import { HiStar } from "react-icons/hi";

const Reviews = (product: any) => {
  return (
    <section className="py-16 2xl:py-44 bg-gradient-to-br from-gray-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-t-10xl overflow-hidden">
      <div className="container px-4 mx-auto">
        <span className="inline-block mb-14 text-3xl font-bold text-gradient-primary">
          {product.product.ratings.length} reviews
        </span>

        {product.product.ratings.map((item: any) => (
          <div
            className="mb-4 shadow-xl rounded-2xl overflow-hidden glass-card hover:shadow-2xl transition-all duration-300"
            key={item.name}
          >
            <div className="pt-3 pb-3 md:pb-1 px-4 md:px-16 bg-gradient-to-r from-white/80 to-primary-50/50 dark:from-gray-800/80 dark:to-primary-900/20">
              <div className="flex flex-wrap items-center">
                <img
                  className="mr-6"
                  src={`https://ui-avatars.com/api/?name=${
                    item?.user?.username || "Deleted User"
                  }&rounded=true`}
                  alt={item.name}
                />
                <h4 className="w-full md:w-auto text-xl font-heading font-medium">
                  {item?.user?.username || "Deleted User"}
                </h4>
                <div className="w-full md:w-px h-2 md:h-8 mx-8 bg-transparent md:bg-gray-200"></div>
                <span className="mr-4 text-xl font-heading font-medium">
                  {item.rating}
                </span>
                <div className="inline-flex">
                  {[...Array(5)].map((star: any, index: any) => {
                    const value = index + 1;
                    return (
                      <HiStar
                        key={index}
                        aria-hidden="true"
                        className={`w-7 h-7 cursor-pointer transition-colors ${
                          value <= item.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300 fill-gray-300"
                        }`}
                        title={`${value} star`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="px-4 overflow-hidden md:px-16 pt-8 pb-12 bg-white dark:bg-gray-800/50">
              <div className="flex flex-wrap">
                <div className="w-full md:w-2/3 mb-6 md:mb-0">
                  <p className="max-w-2xl text-darkBlueGray-400 leading-loose">
                    {item.review}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
        {/* <div className="text-center mt-10">
          <button className="inline-block w-full md:w-auto h-full py-4 px-10 leading-8 font-heading font-medium tracking-tighter text-xl text-white bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-xl">
            See all
          </button>
        </div> */}
      </div>
    </section>
  );
};

export default Reviews;
