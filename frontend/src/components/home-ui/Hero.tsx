import React from "react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden">
      <div className="relative bg-gradient-to-br from-primary-600 via-pink-500 to-accent-500 min-h-[50vh] flex items-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534802046520-4f27db7f3ae5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2729&q=80')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center pt-12 pb-12">
            <h1 className="mb-4 text-5xl md:text-6xl font-extrabold text-white leading-tight">
              Welcome to Our Online Store!
            </h1>
            <p className="lead mb-8 px-4 text-xl md:text-2xl text-gray-100">
              Discover an Amazing Selection of Products and Start Shopping
              Today!
            </p>
            <button
              onClick={() => navigate(`/search?category=All`)}
              className="bg-white text-primary-600 py-4 px-8 rounded-xl font-bold text-lg hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-white/50 transition-all duration-300 hover:scale-105 shadow-2xl"
            >
              Explore Our Collection
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
