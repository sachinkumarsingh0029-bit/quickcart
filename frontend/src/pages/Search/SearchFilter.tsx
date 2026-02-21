import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { IoIosStar, IoIosStarHalf } from "react-icons/io";
import { searchProducts, searchProductsByCategory } from "../../api/product";
import { addItem as addItemToCart } from "../../redux/cart/cartSlice";
import { addItem } from "../../redux/wishlist/wishlistSlice";
import { CreateToast } from "../../utils/Toast";

interface CartItem {
  _id: string;
  productName: string;
  price: number;
  discountedPrice: number;
  productDescription: "";
  thumbnailUrl: string;
  quantity: number;
}

interface wishlistItem {
  _id: string;
  productName: string;
  productDescription: string;
  discountedPrice: number;
  thumbnailUrl: string;
  price: string;
}

const SearchFilter = () => {
  // const { query } = useParams();
  const [query, setQuery] = useState<any>("");
  const [category, setCategory] = useState<any>("");
  const [products, setProducts] = useState<any>([]);
  const [tempProducts, setTempProducts] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [popularitySort, setPopularitySort] = useState("");
  const [priceSort, setPriceSort] = useState("");
  const [availabilitySort, setAvailabilitySort] = useState(false);

  const navigate = useNavigate();
  const isMountedRef = useRef(false);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  // get products by query
  async function getProductsByQuery(query: any) {
    const response = await searchProducts(query);
    setSellers(response.sellers);
    setProducts(response.products);
    setTempProducts(response.products);
  }

  // get products by category
  async function getProductsByCategory(category: any) {
    const response = await searchProductsByCategory(category);
    console.log(response);
    setSellers(response.sellers);
    setProducts(response.products);
    setTempProducts(response.products);
  }

  useEffect(() => {
    const url = new URL(window.location.href);
    const query = url.searchParams.get("query");
    const category = url.searchParams.get("category");
    if (query?.length !== 0) setQuery(query);
    if (category?.length !== 0) setCategory(category);
  }, []);

  // by query
  useEffect(() => {
    // Only call getProductsByQuery() if the component has mounted
    if (isMountedRef.current) {
      if (query && query.length > 0 && products.length === 0) {
        getProductsByQuery(query);
      }
    } else {
      isMountedRef.current = true;
    }
  }, [query]);

  // by category
  useEffect(() => {
    // Only call getProductsByQuery() if the component has mounted
    if (isMountedRef.current) {
      if (category && category.length > 0 && products.length === 0) {
        getProductsByCategory(category);
      }
    } else {
      isMountedRef.current = true;
    }
  }, [category]);

  const handleAddToCart = (product: CartItem) => {
    const cartItem = {
      _id: product._id,
      productName: product.productName,
      price: product.price,
      productDescription: product.productDescription,
      discountedPrice: product.discountedPrice,
      thumbnailUrl: product.thumbnailUrl,
      quantity: 1,
    };
    dispatch(addItemToCart(cartItem));
    CreateToast("addedToCart", "Product successfully added to cart", "success");
  };

  const handleAddToWishlist = (product: wishlistItem) => {
    const wishlistItem = {
      _id: product._id,
      productName: product.productName,
      discountedPrice:
        product.discountedPrice !== 0 ? product.discountedPrice : product.price,
      productDescription: product.productDescription,
      thumbnailUrl: product.thumbnailUrl,
    };
    dispatch(addItem(wishlistItem));
    navigate("/wishlist");
  };

  const categories = products.reduce((acc: any, product: any) => {
    if (acc[product.category]) {
      acc[product.category].push(product.name);
    } else {
      acc[product.category] = [product.name];
    }
    return acc;
  }, {});

  function filterProducts(category: any) {
    const filteredProducts = products.filter(
      (product: any) => product.category === category
    );
    setProducts(filteredProducts);
  }

  useEffect(() => {
    let sortedProducts = [...tempProducts];

    if (availabilitySort) {
      sortedProducts = sortedProducts.filter(
        (product: any) => product.isAvailable
      );
      setProducts([...sortedProducts]);
    } else {
      sortedProducts = [...tempProducts];
      setProducts([...sortedProducts]);
    }

    if (popularitySort === "Popularity" && priceSort === "Price") {
      setProducts([...sortedProducts]);
    } else if (popularitySort !== "Popularity" && priceSort === "Price") {
      setProducts(
        [...sortedProducts].sort(
          (a: any, b: any) => a.discountedPrice - b.discountedPrice
        )
      );
    } else if (popularitySort === "Popularity" && priceSort !== "Price") {
      setProducts(
        [...sortedProducts].sort((a: any, b: any) => b.views - a.views)
      );
    } else if (popularitySort === "Top likes" && priceSort !== "Price") {
      setProducts(
        [...sortedProducts].sort(
          (a: any, b: any) => b.likes.length - a.likes.length
        )
      );
    } else if (popularitySort === "Top Rating" && priceSort !== "Price") {
      setProducts(
        [...sortedProducts].sort(
          (a: any, b: any) => b.ratingsAvg - a.ratingsAvg
        )
      );
    } else if (priceSort === "Low to high") {
      setProducts(
        [...sortedProducts].sort(
          (a: any, b: any) => a.discountedPrice - b.discountedPrice
        )
      );
    } else if (priceSort === "High to low") {
      setProducts(
        [...sortedProducts].sort(
          (a: any, b: any) => b.discountedPrice - a.discountedPrice
        )
      );
    }
  }, [popularitySort, priceSort, availabilitySort]);
  console.log(sellers);

  function handlePopularityChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setPopularitySort(event.target.value);
    if (event.target.value === "Popularity") {
      setProducts(tempProducts);
    }
  }

  function handlePriceChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setPriceSort(event.target.value);
    if (event.target.value === "Price") {
      setProducts(tempProducts);
    }
  }

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl">
        <div className="lg:flex lg:items-center lg:justify-between">
          <p className="text-xl font-bold text-gray-500 dark:text-gray-400">
            Search result for:
            <span className="text-gray-800 dark:text-white">
              {" "}
              {query || category}
            </span>
          </p>
          <div className="mt-5 overflow-x-auto lg:hidden">
            <div className="flex flex-nowrap gap-2">
              <button
                type="button"
                className="inline-flex whitespace-nowrap items-center justify-center px-4 py-2 text-gray-800 rounded-xl"
              >
                <svg
                  className="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  ></path>
                </svg>
                All Filters
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center px-4 py-2 text-gray-800 border rounded-xl whitespace-nowrap"
              >
                Category
                <svg
                  className="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center px-4 py-2 text-gray-800 border rounded-xl whitespace-nowrap"
              >
                Size
                <svg
                  className="w-5 h-5 pb"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center px-4 py-2 text-gray-800 border vg rounded-xl whitespace-nowrap"
              >
                Size
                <svg
                  className="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
          <div className="hidden gap-2 lg:flex lg:items-center lg:justify-end">
            <div className="flex items-center py-3 pl-3 border border-black dark:border-white rounded-md">
              <label className="text-sm font-medium text-gray-800 dark:text-white whitespace-nowrap">
                Sort by:
              </label>
              <select
                className="block w-full my-0 pl-0 ml-1 text-sm text-gray-600 dark:text-gray-100 dark:bg-gray-900 outline-none mr-2"
                onChange={handlePopularityChange}
              >
                <option>Popularity</option>
                <option>Top likes</option>
                <option>Top Views</option>
                <option>Top Rating</option>
              </select>
            </div>
            <div className="flex items-center py-3 pl-3 border border-black dark:border-white rounded-md">
              <label className="text-sm font-medium text-gray-800 dark:text-white whitespace-nowrap">
                Sort by:
              </label>
              <select
                className="block w-full my-0 pl-0 ml-1 text-sm text-gray-600 dark:text-gray-100 dark:bg-gray-900 outline-none mr-2"
                onChange={handlePriceChange}
              >
                <option>Price</option>
                <option>Low to high</option>
                <option>High to low</option>
              </select>
            </div>
            <div className="flex items-center py-3 pl-3 border border-black dark:border-white rounded-md">
              <label className="text-sm font-medium text-gray-800 dark:text-white whitespace-nowrap">
                Availability:
              </label>
              <input
                type="checkbox"
                checked={availabilitySort}
                onChange={() => setAvailabilitySort(!availabilitySort)}
                className="ml-2 mr-2 leading-tight text-blue-600 border-gray-300 rounded focus:outline-none focus:border-blue-400 focus:shadow-outline-blue active:bg-gray-50 active:text-blue-800 transition duration-150 ease-in-out"
              />
            </div>
          </div>
        </div>
        <div className="grid md:mt-10 lg:grid-cols-4 grid-cols-1 gap-8 gap-y-10 gap-x-8">
          <div className="space-y-5 hidden md:block">
            <div className="bg-white border border-gray-200 rounded-md">
              <div className="px-7 py-6">
                <p className="text-lg font-bold text-gray-800">Category</p>
                <ul className="mt-4">
                  {Object.keys(categories).map((category) => (
                    <li>
                      <span
                        title="New in"
                        className="font-medium text-gray-500 cursor-pointer"
                        onClick={() => filterProducts(category)}
                      >
                        {category}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-md">
              <div className="px-7 py-6">
                <p className="text-lg font-bold text-gray-800">Sellers</p>
                <div className="mt-6">
                  {sellers.length > 0 ? (
                    sellers.map((seller: any) => (
                      <div
                        key={seller._id}
                        className="bg-gray-100 rounded-md p-4 w-full mt-4"
                      >
                        <p className="text-lg font-medium text-gray-800">
                          {seller?.businessName}
                        </p>
                        <p className="text-gray-600">{seller?.businessType}</p>
                        <p className="text-gray-600">
                          {seller?.productCategories?.join(", ")}
                        </p>
                        <div className="flex justify-start mt-2">
                          <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                            onClick={() =>
                              navigate(`/seller/${seller?.businessUsername}`)
                            }
                          >
                            Profile
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div>No seller found</div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* products border-2 border-dashed */}
          <div className="col-span-3  h-full mt-4 md:mt-0 rounded-xl min-h-[200px]">
            {products ? (
              products.map((product: any) => (
                <div className="flex w-full space-x-2 sm:space-x-4 pb-5 align-middle justify-center cursor-pointer">
                  <div
                    className="relative flex w-48 sm:w-96"
                    onClick={() => navigate(`/product?query=${product._id}`)}
                  >
                    <div className="absolute inset-0 bg-gray-100"></div>
                    <img
                      className="absolute inset-0 object-contain object-center w-full h-full p-2"
                      src={product.thumbnailUrl}
                      alt={product.productName}
                    />
                  </div>
                  <div className="flex flex-col justify-between w-full pb-4">
                    <div
                      className="flex justify-between w-full pb-2 space-x-2"
                      onClick={() => navigate(`/product?query=${product._id}`)}
                    >
                      <div className="space-y-1">
                        <h3 className="text-lg font-semibold leading-snug sm:pr-8">
                          {product.productName}
                        </h3>
                        <p
                          className="text-sm dark:text-gray-400"
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {product.productDescription}
                        </p>
                        <div className="flex items-center mt-1">
                          {[...Array(5)].map((star: any, index: any) => {
                            const value = index + 1;
                            return (
                              <svg
                                key={index}
                                aria-hidden="true"
                                className={`w-5 h-5 ${
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
                        <span className="text-sm text-gray-500 ml-1 flex items-center">
                          <span className="mr-1">Sold by:</span>
                          <span className="font-medium">
                            {product?.seller?.businessName}
                          </span>
                        </span>
                        {product?.discountedPrice !== 0 ? (
                          <div className="mt-1 flex items-end">
                            <p className="text-xs line-through font-medium text-gray-500 dark:text-gray-100">
                              ₹{product?.price}
                            </p>
                            <p className="text-md font-medium text-gray-900 dark:text-white">
                              &nbsp;&nbsp;₹{product?.discountedPrice}
                            </p>
                            &nbsp;&nbsp;
                            <p className="text-sm font-medium text-green-500">
                              ₹{product?.price - product?.discountedPrice}
                            </p>
                          </div>
                        ) : (
                          <div className="mt-1 flex items-end">
                            <p className="text-xs line-through font-medium text-gray-500 dark:text-gray-100">
                              ₹{product?.price}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    {product?.isAvailable ? (
                      <div className="flex justify-start">
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-2"
                          onClick={() => handleAddToCart(product)}
                        >
                          <FaShoppingCart className="w-4 h-4 fill-current mr-2" />
                          <span>Add to cart</span>
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 cursor-pointer"
                          onClick={() => handleAddToWishlist(product)}
                        >
                          <FaHeart className="w-4 h-4 fill-current mr-2" />
                          <span>Add to wishlist</span>
                        </button>
                      </div>
                    ) : (
                      <p className="text-red-500 font-medium">Out of stock</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div>No product found</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchFilter;
