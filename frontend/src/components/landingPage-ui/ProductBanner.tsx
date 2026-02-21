import React, { useEffect, useRef, useState } from "react";
import { getTrandingProductsThree } from "../../api/product";
import { useNavigate } from "react-router-dom";
import Trending from "../home-ui/Trending";

interface Response {
  trending: [];
  views: [];
  likes: [];
  ratings: [];
}

const ProductBanner = () => {
  const [showCards, setShowCards] = useState("trending");

  const [products, setProducts] = useState<Response>();
  const navigate = useNavigate();
  const isMountedRef = useRef(false);

  console.log(products);
  async function getProducts() {
    const response = await getTrandingProductsThree();
    console.log(response);
    setProducts(response);
  }

  useEffect(() => {
    // Only call getProducts() if the component has mounted
    if (isMountedRef.current) {
      getProducts();
    } else {
      isMountedRef.current = true;
    }
  }, []);

  const activeClasses = "bg-gradient-primary text-white shadow-lg";
  const inactiveClasses =
    "text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gradient-to-r hover:from-primary-50 hover:to-pink-50 dark:hover:from-primary-900/30 dark:hover:to-pink-900/30";

  return (
    <section className="pt-20 lg:pt-[120px] bg-gradient-to-br from-white via-primary-50/30 to-pink-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto" id="product">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4 dark:text-white">
            <div className="mx-auto mb-[60px] max-w-[510px] text-center">
              <span className="mb-2 block text-lg font-bold text-gradient-primary">
                Your One-Stop Shop for Bulk Orders
              </span>
              <h2 className="mb-4 text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                Highlighted Products
              </h2>
              <p className="text-base text-gray-600 dark:text-gray-400">
                Discover our top-quality highlighted products and easily place
                your bulk order with us. Find everything you need, from
                electronics to home essentials, all in one place.
              </p>
            </div>
          </div>
        </div>
        <div className="-mx-4 flex flex-wrap justify-center">
          <div className="w-full px-4">
            <ul className="mb-12 flex flex-wrap justify-center gap-2">
              <li className="mb-1">
                <button
                  onClick={() => setShowCards("trending")}
                  className={`inline-block rounded-xl py-3 px-6 text-center text-base font-bold transition-all duration-300 hover:scale-105 md:py-3 lg:px-8 ${
                    showCards === "trending" ? activeClasses : inactiveClasses
                  }`}
                >
                  Trending
                </button>
              </li>
              <li className="mb-1">
                <button
                  onClick={() => setShowCards("views")}
                  className={`inline-block rounded-xl py-3 px-6 text-center text-base font-bold transition-all duration-300 hover:scale-105 md:py-3 lg:px-8 ${
                    showCards === "views" ? activeClasses : inactiveClasses
                  }`}
                >
                  Top views
                </button>
              </li>
              <li className="mb-1">
                <button
                  onClick={() => setShowCards("likes")}
                  className={`inline-block rounded-xl py-3 px-6 text-center text-base font-bold transition-all duration-300 hover:scale-105 md:py-3 lg:px-8 ${
                    showCards === "likes" ? activeClasses : inactiveClasses
                  }`}
                >
                  Top Likes
                </button>
              </li>
              <li className="mb-1">
                <button
                  onClick={() => setShowCards("ratings")}
                  className={`inline-block rounded-xl py-3 px-6 text-center text-base font-bold transition-all duration-300 hover:scale-105 md:py-3 lg:px-8 ${
                    showCards === "ratings" ? activeClasses : inactiveClasses
                  }`}
                >
                  Top Ratings
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="-mx-4 flex flex-wrap">
          {products?.trending?.map((product: any) => (
            <div
              className={`w-full px-4 md:w-1/2 xl:w-1/3 ${
                showCards === "all" || showCards === "trending"
                  ? "block"
                  : "hidden"
              }`}
              key={product.productName}
            >
              <div className="relative mb-12 flex h-full flex-col">
                <div className="overflow-hidden rounded-lg h-64">
                  <img
                    src={product.thumbnailUrl}
                    alt="portfolio"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="relative z-10 mx-7 -mt-20 flex flex-1 flex-col rounded-xl glass-card py-6 px-4 text-center shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 min-h-[200px]">
                  <span className="mb-2 block text-sm font-bold text-gradient-primary">
                    {product.category}
                  </span>
                  <h3 className="mb-3 text-lg font-bold text-gray-900 dark:text-white line-clamp-2 min-h-[3.5rem]">
                    {product.productName}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4 text-lg font-bold flex-shrink-0">
                    Price: ₹{product.discountedPrice}
                  </p>
                  <div className="mt-auto">
                    <a
                      href="javascript:void(0)"
                      className="inline-block rounded-lg bg-gradient-primary py-3 px-7 text-sm font-bold text-white transition-all duration-300 hover:shadow-lg hover:scale-105"
                      onClick={() => navigate(`/product?query=${product._id}`)}
                    >
                      View Details
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {products?.views?.map((product: any) => (
            <div
              className={`w-full px-4 md:w-1/2 xl:w-1/3 ${
                showCards === "all" || showCards === "views"
                  ? "block"
                  : "hidden"
              }`}
              key={product.productName}
            >
              <div className="relative mb-12 flex h-full flex-col">
                <div className="overflow-hidden rounded-lg h-64">
                  <img
                    src={product.thumbnailUrl}
                    alt="portfolio"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="relative z-10 mx-7 -mt-20 flex flex-1 flex-col rounded-xl glass-card py-6 px-4 text-center shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 min-h-[200px]">
                  <span className="mb-2 block text-sm font-bold text-gradient-primary">
                    {product.category}
                  </span>
                  <h3 className="mb-3 text-lg font-bold text-gray-900 dark:text-white line-clamp-2 min-h-[3.5rem]">
                    {product.productName}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4 text-lg font-bold flex-shrink-0">
                    Price: ₹{product.discountedPrice}
                  </p>
                  <div className="mt-auto">
                    <a
                      href="javascript:void(0)"
                      className="inline-block rounded-lg bg-gradient-primary py-3 px-7 text-sm font-bold text-white transition-all duration-300 hover:shadow-lg hover:scale-105"
                      onClick={() => navigate(`/product?query=${product._id}`)}
                    >
                      View Details
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {products?.likes?.map((product: any) => (
            <div
              className={`w-full px-4 md:w-1/2 xl:w-1/3 ${
                showCards === "all" || showCards === "likes"
                  ? "block"
                  : "hidden"
              }`}
              key={product.productName}
            >
              <div className="relative mb-12 flex h-full flex-col">
                <div className="overflow-hidden rounded-lg h-64">
                  <img
                    src={product.thumbnailUrl}
                    alt="portfolio"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="relative z-10 mx-7 -mt-20 flex flex-1 flex-col rounded-xl glass-card py-6 px-4 text-center shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 min-h-[200px]">
                  <span className="mb-2 block text-sm font-bold text-gradient-primary">
                    {product.category}
                  </span>
                  <h3 className="mb-3 text-lg font-bold text-gray-900 dark:text-white line-clamp-2 min-h-[3.5rem]">
                    {product.productName}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4 text-lg font-bold flex-shrink-0">
                    Price: ₹
                    {product.discountedPrice
                      ? product.discountedPrice
                      : product.price}
                  </p>
                  <div className="mt-auto">
                    <a
                      href="javascript:void(0)"
                      className="inline-block rounded-lg bg-gradient-primary py-3 px-7 text-sm font-bold text-white transition-all duration-300 hover:shadow-lg hover:scale-105"
                      onClick={() => navigate(`/product?query=${product._id}`)}
                    >
                      View Details
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {products?.ratings?.map((product: any) => (
            <div
              className={`w-full px-4 md:w-1/2 xl:w-1/3 ${
                showCards === "all" || showCards === "ratings"
                  ? "block"
                  : "hidden"
              }`}
              key={product.productName}
            >
              <div className="relative mb-12 flex h-full flex-col">
                <div className="overflow-hidden rounded-lg h-64">
                  <img
                    src={product.thumbnailUrl}
                    alt="portfolio"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="relative z-10 mx-7 -mt-20 flex flex-1 flex-col rounded-xl glass-card py-6 px-4 text-center shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 min-h-[200px]">
                  <span className="mb-2 block text-sm font-bold text-gradient-primary">
                    {product.category}
                  </span>
                  <h3 className="mb-3 text-lg font-bold text-gray-900 dark:text-white line-clamp-2 min-h-[3.5rem]">
                    {product.productName}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4 text-lg font-bold flex-shrink-0">
                    Price: ₹
                    {product.discountedPrice
                      ? product.discountedPrice
                      : product.price}
                  </p>
                  <div className="mt-auto">
                    <a
                      href="javascript:void(0)"
                      className="inline-block rounded-lg bg-gradient-primary py-3 px-7 text-sm font-bold text-white transition-all duration-300 hover:shadow-lg hover:scale-105"
                      onClick={() => navigate(`/product?query=${product._id}`)}
                    >
                      View Details
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductBanner;
