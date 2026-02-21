import React, { useEffect, useRef, useState } from "react";
import { getRecommendedProducts } from "../../api/product";
import { useNavigate } from "react-router-dom";
import { addItem } from "../../redux/cart/cartSlice";
import { CreateToast } from "../../utils/Toast";
import { useDispatch } from "react-redux";

interface CartItem {
  _id: string;
  productName: string;
  price: number;
  discountedPrice: number;
  productDescription: "";
  thumbnailUrl: string;
  quantity: number;
}

const Recommendations = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const isMountedRef = useRef(false);
  const dispatch = useDispatch();

  async function getProducts() {
    const response = await getRecommendedProducts();
    setProducts(response.products);
  }

  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      getProducts();
    }
  }, []);

  const handleAddToCart = (product: CartItem) => {
    console.log(product);
    const cartItem = {
      _id: product._id,
      productName: product.productName,
      price: product.price,
      productDescription: product.productDescription,
      discountedPrice: product.discountedPrice,
      thumbnailUrl: product.thumbnailUrl,
      quantity: 1,
    };
    dispatch(addItem(cartItem));
    CreateToast("addedToCart", "Product successfully added to cart", "success");
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, index) => {
          const value = index + 1;
          return (
            <svg
              key={index}
              className={`w-4 h-4 ${
                value <= Math.round(rating)
                  ? "text-yellow-400"
                  : "text-gray-300 dark:text-gray-600"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          );
        })}
      </div>
    );
  };

  return (
    <div className="my-8">
      <h2 className="w-full mb-8 text-3xl md:text-4xl text-center font-bold text-gray-900 dark:text-white">
        Recommendations
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-16">
        {products &&
          products.map((product: any) => (
            <div
              key={product._id}
              className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              {/* Product Image */}
              <div
                className="relative w-full h-48 sm:h-56 overflow-hidden bg-gray-200 dark:bg-gray-700 cursor-pointer"
                onClick={() => navigate(`/product?query=${product._id}`)}
              >
                <img
                  src={product.thumbnailUrl}
                  alt={product.productName}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {product.discountedPrice && product.discountedPrice < product.price && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    Sale
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3
                  className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  onClick={() => navigate(`/product?query=${product._id}`)}
                >
                  {product.productName}
                </h3>
                <p
                  className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {product.productDescription}
                </p>

                {/* Rating */}
                {product.ratingsAvg && (
                  <div className="flex items-center gap-2 mb-3">
                    {renderStars(product.ratingsAvg)}
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      ({product.ratingsAvg.toFixed(1)})
                    </span>
                  </div>
                )}

                {/* Price and Add to Cart */}
                <div className="flex items-center justify-between mt-4">
                  <div className="flex flex-col">
                    {product.discountedPrice && product.discountedPrice < product.price ? (
                      <>
                        <span className="text-lg font-bold text-green-600 dark:text-green-400">
                          ₹{product.discountedPrice}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                          ₹{product.price}
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        ₹{product.price}
                      </span>
                    )}
                  </div>
                  <button
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white text-sm font-semibold rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Recommendations;
