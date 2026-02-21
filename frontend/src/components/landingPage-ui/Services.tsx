import React from "react";
import { HiCurrencyDollar, HiBuildingStorefront, HiGlobeAlt, HiCreditCard, HiShieldCheck, HiChartBar } from "react-icons/hi2";

function Services() {
  const services = [
    {
      icon: HiCurrencyDollar,
      title: "No-fee Transactions",
      description: "Our blockchain-based platform allows you to conduct transactions without any platform fees, helping you keep more of your profits.",
      gradient: "from-primary-500 to-primary-600"
    },
    {
      icon: HiBuildingStorefront,
      title: "Bulk Trading",
      description: "Buy and sell products in large quantities with ease using our marketplace. Whether you're a buyer or seller, our platform makes bulk trading simple and secure.",
      gradient: "from-secondary-500 to-secondary-600"
    },
    {
      icon: HiGlobeAlt,
      title: "Global Reach",
      description: "With QuickCart, you can reach a global audience of potential buyers and sellers, giving you access to new markets and opportunities.",
      gradient: "from-accent-500 to-accent-600"
    },
    {
      icon: HiCreditCard,
      title: "Payment Flexibility",
      description: "Our marketplace allows you to pay and receive payments using either blockchain or PayPal, providing flexibility and convenience for your transactions.",
      gradient: "from-pink-500 to-pink-600"
    },
    {
      icon: HiShieldCheck,
      title: "Secure Transactions",
      description: "Our platform uses blockchain technology to ensure secure and transparent transactions for buyers and sellers, providing peace of mind for all parties.",
      gradient: "from-green-500 to-green-600"
    },
    {
      icon: HiChartBar,
      title: "Intuitive Dashboard",
      description: "Easily manage your orders and sales with our intuitive dashboard feature, giving you insights into your transactions and helping you make informed decisions.",
      gradient: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <section className="p-10 lg:pt-[120px] bg-gradient-to-br from-white via-primary-50/20 to-pink-50/20 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" id="services">
      <div className="container mx-auto">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="mx-auto mb-12 max-w-[510px] text-center lg:mb-20">
              <span className="mb-2 block text-lg font-bold text-gradient-primary">
                Our Services
              </span>
              <h2 className="mb-4 text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                Discover What We Offer
              </h2>
              <p className="text-base text-gray-600 dark:text-gray-400">
                Discover QuickCart's Value-Added Services. From no-fee
                transactions to secure payments and intuitive dashboards, we've
                got you covered.
              </p>
            </div>
          </div>
        </div>
        <div className="-mx-4 flex flex-wrap">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div key={index} className="w-full px-4 md:w-1/2 lg:w-1/3">
                <div className="mb-8 rounded-2xl glass-card p-10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 md:px-7 xl:px-10">
                  <div className={`mb-8 flex h-[70px] w-[70px] items-center justify-center rounded-2xl bg-gradient-to-br ${service.gradient} shadow-lg`}>
                    <IconComponent className="w-10 h-10 text-white" />
                  </div>
                  <h4 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">
                    {service.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    {service.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Services;
