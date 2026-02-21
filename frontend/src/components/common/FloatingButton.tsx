import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/rootReducer";
import { store } from "../../redux/store";
import { setTheme } from "../../redux/theme/themeSlice";
import { useNavigate } from "react-router-dom";
import { HiSun, HiMoon, HiHome, HiShoppingCart } from "react-icons/hi";
import { HiCog6Tooth } from "react-icons/hi2";

const FloatingButton = () => {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const handleThemeSwitch = () => {
    store.dispatch(setTheme(theme === "dark" ? "light" : "dark"));
  };
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const navigate = useNavigate();

  const handleRedirect = (path: any) => {
    navigate(path);
  };

  return (
    <div>
      <div className="group fixed bottom-5 right-5 p-2 flex items-end justify-end w-24 h-24 z-50">
        <div className="text-white shadow-2xl flex items-center justify-center p-4 rounded-full bg-gradient-primary z-50 absolute animate-pulse-slow hover:animate-none hover:scale-110 transition-all duration-300 cursor-pointer">
          <HiCog6Tooth className="w-7 h-7 group-hover:rotate-90 transition-all duration-600" />
        </div>
        <div
          className="absolute rounded-full transition-all duration-300 ease-out scale-y-0 group-hover:scale-y-100 group-hover:-translate-x-16 flex items-center justify-center p-3 hover:p-4 bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-lg hover:shadow-xl hover:scale-110 cursor-pointer"
          onClick={handleThemeSwitch}
        >
          {theme === "dark" ? (
            <HiSun className="w-6 h-6 text-yellow-200" />
          ) : (
            <HiMoon className="w-6 h-6 text-blue-100" />
          )}
        </div>
        <div
          className="absolute rounded-full transition-all duration-300 ease-out scale-x-0 group-hover:scale-x-100 group-hover:-translate-y-16 flex items-center justify-center p-3 hover:p-4 bg-gradient-to-br from-secondary-400 to-secondary-600 text-white shadow-lg hover:shadow-xl hover:scale-110 cursor-pointer"
          onClick={() => handleRedirect("/shop")}
        >
          <HiHome className="w-6 h-6" />
        </div>
        <div
          className="absolute rounded-full transition-all duration-300 ease-out scale-x-0 group-hover:scale-x-100 group-hover:-translate-y-14 group-hover:-translate-x-14 flex items-center justify-center p-3 hover:p-4 bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-lg hover:shadow-xl hover:scale-110 cursor-pointer"
          onClick={() => handleRedirect("/cart")}
        >
          <HiShoppingCart className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default FloatingButton;
