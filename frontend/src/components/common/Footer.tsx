import React from "react";
import { useNavigate } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

function Footer() {
  const navigate = useNavigate();
  return (
    <div className="bg-gradient-to-br from-gray-50 via-primary-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-t border-primary-200 dark:border-primary-800">
      <footer className="container mx-auto px-10 md:px-0 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="grow mt-4 md:mt-0 md:ml-12">
            <p className="font-bold text-lg text-gradient-primary">
              © 2024 QuickCart
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Your trusted marketplace for amazing products
            </p>
          </div>
          <div className="flex space-x-4 mt-6 md:mt-0">
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white hover:scale-110 hover:shadow-lg transition-all duration-300 cursor-pointer"
              aria-label="Facebook"
            >
              <FaFacebook className="w-6 h-6" />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-500 flex items-center justify-center text-white hover:scale-110 hover:shadow-lg transition-all duration-300 cursor-pointer"
              aria-label="Twitter"
            >
              <FaTwitter className="w-6 h-6" />
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center text-white hover:scale-110 hover:shadow-lg transition-all duration-300 cursor-pointer"
              aria-label="Instagram"
            >
              <FaInstagram className="w-6 h-6" />
            </a>
            <a 
              href="https://youtube.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white hover:scale-110 hover:shadow-lg transition-all duration-300 cursor-pointer"
              aria-label="YouTube"
            >
              <FaYoutube className="w-6 h-6" />
            </a>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-center lg:space-x-12 w-[100%] mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="m-4 w-full text-center flex justify-center">
            <ul className="flex flex-row flex-wrap justify-center gap-4 font-medium text-sm">
              <li>
                <a 
                  onClick={() => navigate("/privacypolicy")}
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer transition-colors duration-300"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a 
                  onClick={() => navigate("/termsandconditions")}
                  className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer transition-colors duration-300"
                >
                  Terms of Service
                </a>
              </li>
              <li className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer transition-colors duration-300">
                Cookie Policy
              </li>
              <li className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer transition-colors duration-300">
                Disclaimer
              </li>
              <li className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer transition-colors duration-300">
                Media Policy
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
