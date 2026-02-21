import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTrandingProducts } from "../../api/product";

export default function Trending() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const isMountedRef = useRef(false);

  async function getProducts() {
    const response = await getTrandingProducts();
    setProducts(response.products);
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
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-0 sm:px-6 sm:py-0 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Trending
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products &&
            products.map((product: any) => (
              <div
                key={product.id}
                className="group relative cursor-pointer"
                onClick={() => navigate(`/product?query=${product._id}`)}
              >
                <div className="min-h-80 aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                  <img
                    src={product.thumbnailUrl}
                    alt={product.productName}
                    className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                  />
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <a href={product.href}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.productName}
                      </a>
                    </h3>

                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((star: any, index: any) => {
                        const value = index + 1;
                        return (
                          <svg
                            key={index}
                            aria-hidden="true"
                            className={`w-3 h-3 ${
                              value <= product.ratingsAvg
                                ? "text-yellow-400"
                                : "text-gray-400"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <title>{`${value} star`}</title>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                        );
                      })}
                      <span className="text-sm text-gray-500 ml-1">
                        ({product?.ratingsAvg})
                      </span>
                    </div>
                  </div>
                  {product?.discountedPrice ? (
                    <div>
                      <p className="text-xs line-through font-medium text-gray-500 dark:text-gray-100">
                        ₹{product.price}
                      </p>
                      <p className="text-md font-medium text-gray-900 dark:text-white">
                        &nbsp;&nbsp;₹{product.discountedPrice}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-100">
                        ₹{product.price}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
