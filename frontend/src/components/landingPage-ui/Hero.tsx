import React from "react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-700 to-pink-700 pt-24 pb-20 lg:pt-28 lg:pb-24">
      {/* Decorative blurred blobs */}
      <div className="pointer-events-none absolute -top-32 -left-24 h-72 w-72 rounded-full bg-pink-500 opacity-40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 h-80 w-80 rounded-full bg-cyan-400 opacity-40 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left: Text & CTAs */}
          <div className="space-y-6 text-left">
            <p className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-pink-100 backdrop-blur">
              Bold. Fast. Borderless.
            </p>

            <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
              Power your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-yellow-300 to-cyan-300">
                bulk commerce
              </span>{" "}
              with QuickCart.
            </h1>

            <p className="max-w-xl text-base text-pink-100 sm:text-lg">
              Trade in bulk with zero platform fees, secure blockchain payments,
              and a powerful dashboard that keeps every order, payment, and
              shipment under control.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={() => navigate("/shop")}
                className="rounded-xl bg-gradient-to-r from-primary-500 to-pink-500 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-500/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-pink-300"
              >
                Start Shopping
              </button>
              <button
                onClick={() => navigate("/applyforseller")}
                className="rounded-xl border border-white/30 bg-white/5 px-7 py-3 text-sm font-semibold text-pink-50 backdrop-blur transition-all duration-300 hover:bg-white/15 hover:border-white/60 focus:outline-none focus:ring-2 focus:ring-white/40"
              >
                Launch Your Store
              </button>
            </div>

            <div className="flex flex-wrap gap-6 pt-4 text-sm text-pink-100">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-pink-200">
                  Sellers
                </p>
                <p className="text-lg font-semibold">3K+ onboarded</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-pink-200">
                  Transactions
                </p>
                <p className="text-lg font-semibold">₹50Cr+ processed</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-pink-200">
                  Uptime
                </p>
                <p className="text-lg font-semibold">99.9% reliable</p>
              </div>
            </div>
          </div>

          {/* Right: Stats card (no image) */}
          <div className="relative">
            <div className="relative mx-auto max-w-md rounded-3xl border border-white/40 bg-white/90 p-6 text-gray-900 shadow-2xl backdrop-blur-xl dark:bg-gray-900/90 dark:text-white dark:border-white/10">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-pink-500 dark:text-pink-300">
                Live overview
              </p>
              <h3 className="mt-3 text-2xl font-bold">Today on QuickCart</h3>

              <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-gray-800/90">
                  <p className="text-xs text-gray-500 dark:text-pink-200">Active orders</p>
                  <p className="mt-2 text-2xl font-bold">1,248</p>
                  <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-300">
                    +18% vs last week
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-gray-800/90">
                  <p className="text-xs text-gray-500 dark:text-pink-200">Avg. fulfillment</p>
                  <p className="mt-2 text-2xl font-bold">2.1 days</p>
                  <p className="mt-1 text-xs text-cyan-600 dark:text-cyan-200">Express ready</p>
                </div>
                <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-gray-800/90">
                  <p className="text-xs text-gray-500 dark:text-pink-200">On‑time delivery</p>
                  <p className="mt-2 text-2xl font-bold">98.4%</p>
                  <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-300">
                    Trusted logistics
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-gray-800/90">
                  <p className="text-xs text-gray-500 dark:text-pink-200">Dispute rate</p>
                  <p className="mt-2 text-2xl font-bold">0.3%</p>
                  <p className="mt-1 text-xs text-amber-600 dark:text-amber-200">
                    Proactive support
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between text-xs text-gray-500 dark:text-pink-100">
                <span>Real‑time metrics updated every minute</span>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-gray-700 dark:bg-white/10 dark:text-pink-100">
                  Dashboard preview
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
