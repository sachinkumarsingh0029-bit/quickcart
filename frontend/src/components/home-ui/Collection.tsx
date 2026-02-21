import React, { useEffect, useRef, useState } from "react";
import { getTopProductsByTopCategorySearched } from "../../api/product";
import { useNavigate } from "react-router-dom";

const Collection = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const isMountedRef = useRef(false);

  async function getProducts() {
    const response = await getTopProductsByTopCategorySearched(4);
    setProducts(response);
  }

  useEffect(() => {
    // Only call getProducts() if the component has mounted
    if (isMountedRef.current) {
      if (products.length === 0) {
        getProducts();
      }
    } else {
      isMountedRef.current = true;
    }
  }, []);
  return (
    <section>
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-white ">
        <header>
          <h2 className="text-xl font-bold sm:text-3xl">Product Collection</h2>

          <p className="mt-4 max-w-sm text-gray-500">
            Explore our curated selection of top products that are in high
            demand among our customers. At our store, we are committed to
            delivering a superior shopping experience.
          </p>
        </header>

        <div className="mt-8">
          <p className="text-right text-sm text-gray-500">
            Top Searched Products
          </p>
        </div>

        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products &&
            products.map((product: any) => (
              <li>
                <span className="group block overflow-hidden">
                  <img
                    src={product?.thumbnailUrl}
                    alt=""
                    className="h-[350px] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[450px] cursor-pointer"
                    onClick={() => navigate(`/product?query=${product?._id}`)}
                  />
                  <div className="relative bg-white p-3">
                    <h3 className="text-xs text-gray-700 group-hover:underline group-hover:underline-offset-4">
                      {product?.productName}
                    </h3>

                    <p className="mt-2">
                      <span className="sr-only"> Regular Price </span>

                      <span className="tracking-wider text-gray-900">
                        {" "}
                        ₹
                        {product?.discountedPrice
                          ? product?.discountedPrice
                          : product?.price}{" "}
                      </span>
                    </p>
                  </div>
                </span>
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
};

export default Collection;
