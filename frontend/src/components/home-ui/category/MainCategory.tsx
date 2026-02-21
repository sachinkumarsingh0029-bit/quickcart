import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getTopProductsByTopCategorySearched,
  getTrandingProductsMainCategory,
} from "../../../api/product";

const MainCategory = () => {
  const [products, setProducts] = useState<any>([]);
  const navigate = useNavigate();

  async function getProducts() {
    const response = await getTrandingProductsMainCategory();
    setProducts(response.products);
  }

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <section>
      <div className="max-w-screen-xl px-4 py-8 mx-auto sm:py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:items-stretch">
          <div className="grid p-6 bg-gray-100 rounded place-content-center sm:p-8">
            <div className="max-w-md mx-auto text-center lg:text-left">
              <header>
                <h2 className="text-xl font-bold text-gray-900 sm:text-3xl">
                  {products[0]?.category}{" "}
                  {products[1]?.category &&
                    products[0]?.category !== products[1]?.category &&
                    ` and ${products[1]?.category}`}
                </h2>

                <p className="mt-4 text-gray-500">
                  Discover our carefully curated selection of top products in{" "}
                  {products[0]?.category}{" "}
                  {products[1]?.category &&
                    products[0]?.category !== products[1]?.category &&
                    ` and ${products[1]?.category}`}
                </p>
              </header>

              <span
                onClick={() =>
                  navigate(`/search?category=${products[0]?.category}`)
                }
                className="inline-block px-12 py-3 mt-8 text-sm font-medium text-white transition bg-gray-900 border border-gray-900 rounded hover:shadow focus:outline-none focus:ring"
              >
                Shop All
              </span>
            </div>
          </div>

          <div className="lg:col-span-2 lg:py-8">
            <ul className="grid grid-cols-2 gap-4">
              {products?.map((product: any) => (
                <li>
                  <span
                    onClick={() => navigate(`/product?query=${product._id}`)}
                    className="block group"
                  >
                    <img
                      src={product.thumbnailUrl}
                      alt={product.productName}
                      className="object-cover w-full rounded aspect-square"
                    />

                    <div className="mt-3">
                      <h3 className="font-medium text-gray-900 group-hover:underline group-hover:underline-offset-4">
                        {product.productName}
                      </h3>

                      <p className="mt-1 text-sm text-gray-700">
                        ₹{product.price}
                      </p>
                    </div>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainCategory;
