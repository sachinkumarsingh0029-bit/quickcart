import React, { useState } from "react";
import { HiChevronDown } from "react-icons/hi";

interface FaqFormat {
  question: string;
  answer: string;
}

const FAQ = (faqs: any) => {
  return (
    <section className="relative pt-1 pb-16 bg-gradient-to-br from-gray-50 via-primary-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-64 bg-gradient-to-t from-primary-200/30 to-transparent dark:from-primary-900/20"></div>
      <div className="relative z-10 container px-4 mx-auto">
        <div className="md:max-w-4xl mx-auto">
          <h2 className="mb-16 text-4xl md:text-5xl xl:text-6xl text-center font-bold text-gradient-primary tracking-tight leading-none">
            Frequently Asked Questions
          </h2>
          <div className="mb-11 flex flex-wrap -m-1">
            {faqs.faqs &&
              faqs.faqs.map((faq: any, index: any) => (
                <div className="w-full p-1" key={index}>
                  <div className="py-7 px-8 glass-card border-2 border-primary-200 dark:border-primary-700 hover:border-primary-400 dark:hover:border-primary-500 transition-all duration-300 hover:shadow-xl">
                    <div className="flex flex-wrap justify-between -m-2">
                      <div className="flex-1 p-2">
                        <h3 className="mb-4 text-lg font-bold leading-normal text-gray-900 dark:text-white">
                          {faq.question}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 font-medium">
                          {faq.answer}
                        </p>
                      </div>
                      <div className="w-auto p-2">
                        <HiChevronDown className="relative top-1 w-5 h-5 text-primary-600 dark:text-primary-400" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
