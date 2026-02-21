import { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { addItem, removeItem } from "../../../redux/wishlist/wishlistSlice";
import { useNavigate } from "react-router-dom";

interface wishlistItem {
  _id: string;
  productName: string;
  productDescription: string;
  discountedPrice: number;
  thumbnailUrl: string;
}

interface WishlistState {
  items: wishlistItem[];
}

const WishlistComponent = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const wishlistItems = useSelector(
    (state: { wishlist: WishlistState }) => state.wishlist
  );

  // const handleAddToWishlist = (product: wishlistItem) => {
  //   dispatch(addItem({ product }));
  // };

  const handleRemoveFromCart = (_id: wishlistItem) => {
    dispatch(removeItem({ _id: _id }));
  };

  return (
    <div className="p-4 mt-10">
      <div className="flex flex-col jusitfy-start items-start w-fit">
        <div>
          <p className="text-sm leading-4 text-gray-600 dark:text-white">
            Home
          </p>
        </div>
        <div className="mt-3">
          <h1 className="text-3xl lg:text-4xl tracking-tight font-semibold leading-8 lg:leading-9 text-gray-800 dark:text-white dark:text-white">
            Favourites
          </h1>
        </div>
        <div className="mt-4">
          <p className="text-2xl tracking-tight leading-6 text-gray-600 dark:text-white">
            {wishlistItems.items.length} items
          </p>
        </div>
      </div>
      <div className="mt-10 lg:mt-12 grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-10 lg:gap-y-0">
        {wishlistItems.items.length != 0 ? (
          wishlistItems.items.map((product) => (
            <ProductCard
              key={product._id}
              name={product.productName}
              image={product.thumbnailUrl}
              description={product.productDescription}
              price={product.discountedPrice}
              _id={product._id}
              navigate={navigate}
              handleRemoveFromCart={handleRemoveFromCart}
            />
          ))
        ) : (
          <div className="col-span-3 flex flex-col">
            <p className="text-xl font-semibold mb-4">No items found</p>
            <p className="text-gray-500 mb-4">
              Add items to your wishlist and shop later!
            </p>
            <button
              className="px-4 py-2 bg-indigo-500 text-white rounded-md shadow-md hover:bg-indigo-600 transition duration-200"
              onClick={() => {
                navigate("/shop");
              }}
            >
              Shop now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistComponent;

function ProductCard({
  name,
  image,
  description,
  price,
  handleRemoveFromCart,
  _id,
  navigate,
}: any) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex flex-col">
      <div className="relative cursor-pointer">
        <img
          onClick={() => navigate(`/product?query=${_id}`)}
          className="hidden lg:block"
          src={image}
          alt="bag"
        />
        <img
          onClick={() => navigate(`/product?query=${_id}`)}
          className="hidden sm:block lg:hidden"
          src={image}
          alt="bag"
        />
        <img
          onClick={() => navigate(`/product?query=${_id}`)}
          className="sm:hidden"
          src={image}
          alt="bag"
        />
        <button
          aria-label="close"
          className="top-4 right-4 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 absolute p-1.5 bg-gray-800 dark:bg-white dark:text-gray-800 text-white hover:text-gray-400"
          onClick={() => handleRemoveFromCart(_id)}
        >
          <svg
            className="fil-current"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13 1L1 13"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M1 1L13 13"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      <div className="mt-6 flex justify-between items-center">
        <div className="flex justify-center items-center">
          <p className="tracking-tight text-2xl font-semibold leading-6 text-gray-800 dark:text-white">
            {name}
          </p>
        </div>
        <div className="flex justify-center items-center">
          <button
            aria-label="show menu"
            className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 py-2.5 px-2 bg-gray-800 dark:bg-white dark:text-gray-800 text-white hover:text-gray-400 hover:bg-gray-200"
            onClick={handleToggle}
          >
            <svg
              id="chevronUp1"
              className={`fill-stroke ${isOpen ? "hidden" : ""}`}
              width="10"
              height="6"
              viewBox="0 0 10 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 5L5 1L1 5"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <svg
              id="chevronDown1"
              className={`fill-stroke ${isOpen ? "" : "hidden"}`}
              width="10"
              height="6"
              viewBox="0 0 10 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1 L5 5L9 1"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className={`mt-6 ${isOpen ? "" : "hidden"}`}>
        <div className="flex justify-between items-center">
          <p
            className="text-gray-600 dark:text-gray-400"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {description}
          </p>
        </div>

        <div className="flex justify-between items-center mt-2">
          <p className="text-gray-600 dark:text-gray-400">Price:</p>
          <p className="font-medium text-gray-800 dark:text-white">{price}</p>
        </div>
      </div>
    </div>
  );
}
