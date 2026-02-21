import React, { useState, FormEventHandler } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/rootReducer";
import { useNavigate } from "react-router-dom";
import { HiSearch, HiShoppingCart } from "react-icons/hi";
import { BsThreeDots } from "react-icons/bs";

const NavBar = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );

  const user = useSelector((state: RootState) => state.user.user);

  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch: FormEventHandler<HTMLFormElement> = (e) => {
    // e.preventDefault();
    navigate(`/search?query=${searchQuery}`);
  };

  return (
    <div className="top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow-lg">
      <div className="w-full">
        <nav className="px-4 py-4 flex justify-between items-center bg-gradient-to-r from-white to-primary-50 dark:from-gray-900 dark:to-gray-800 border-b border-primary-200 dark:border-primary-800">
          {/* Left: Logo */}
          <div className="flex-shrink-0">
            <span
              className="text-2xl font-bold text-gradient-primary cursor-pointer flex space-x-1 hover:scale-105 transition-transform duration-300"
              onClick={() => navigate("/")}
            >
              <span>QuickCart</span>
            </span>
          </div>

          {/* Center: Navigation Links */}
          <ul className="hidden lg:flex lg:items-center lg:space-x-6 lg:flex-1 lg:justify-center">
            <li>
              <a
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer transition-colors duration-300"
                onClick={() => navigate("/")}
              >
                Homepage
              </a>
            </li>
            <li className="text-primary-400 dark:text-primary-500">
              <BsThreeDots className="w-4 h-4" />
            </li>
            <li>
              <a
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer transition-colors duration-300"
                onClick={() => navigate("/shop")}
              >
                Browse Products
              </a>
            </li>
            <li className="text-primary-400 dark:text-primary-500">
              <BsThreeDots className="w-4 h-4" />
            </li>
            <li>
              <a
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer transition-colors duration-300"
                onClick={() => navigate("/applyforseller")}
              >
                Launch Store
              </a>
            </li>
          </ul>

          {/* Right: Auth/Cart */}
          <div className="flex-shrink-0">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <button
                  className="hidden text-gray-700 dark:text-gray-200 transition-all duration-300 transform lg:block hover:text-primary-600 dark:hover:text-primary-400 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg p-2"
                  aria-label="show cart"
                  onClick={(e) => navigate("/cart")}
                >
                  <span className="relative">
                    <HiShoppingCart className="w-6 h-6" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-primary text-white text-xs rounded-full flex items-center justify-center font-bold"></span>
                  </span>
                </button>

                <button
                  type="button"
                  className="flex items-center focus:outline-none"
                  aria-label="toggle profile dropdown"
                >
                  <div
                    className="w-10 h-10 overflow-hidden border-2 border-gradient-primary rounded-full hover:ring-2 hover:ring-primary-500 transition-all duration-300 cursor-pointer"
                    onClick={() => navigate("/profile")}
                  >
                    <img
                      src={`https://ui-avatars.com/api/?name=${user.username}`}
                      className="object-cover w-full h-full"
                      alt="avatar"
                    />
                  </div>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  className="rounded-lg border-2 border-primary-600 px-4 py-2 text-sm font-semibold leading-7 text-primary-700 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-all duration-300 hover:scale-105"
                  onClick={() => navigate("/signin")}
                >
                  Login
                </button>
                <button
                  className="rounded-lg bg-gradient-primary px-4 py-2 text-sm font-semibold leading-7 text-white hover:shadow-lg hover:scale-105 transition-all duration-300"
                  onClick={() => navigate("/signup")}
                >
                  SignUp
                </button>
              </div>
            )}
          </div>
        </nav>
        <nav className="px-4 lg:px-8 py-4 bg-gradient-to-r from-white to-primary-50 dark:from-gray-900 dark:to-gray-800">
          <div className="w-full">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                <HiSearch className="w-5 h-5 text-primary-500 dark:text-primary-400" />
              </span>
              <form onSubmit={handleSearch}>
                <input
                  id="query"
                  name="query"
                  type="search"
                  className="w-full py-3 pl-12 pr-4 text-sm bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-gray-700 dark:text-white transition-all duration-300"
                  placeholder="Search products..."
                  onChange={handleInputChange}
                />
              </form>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default NavBar;
