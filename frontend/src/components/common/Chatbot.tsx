import React, { useState, useRef, useEffect } from "react";
import { searchProducts } from "../../api/product";
import { useNavigate } from "react-router-dom";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  products?: any[];
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your shopping assistant. I can help you find products. What are you looking for?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Search for products
      const response = await searchProducts(inputValue.trim());
      const products = response.products || [];

      let botText = "";
      if (products.length === 0) {
        botText =
          "I couldn't find any products matching your search. Try different keywords or browse our categories!";
      } else if (products.length === 1) {
        botText = `I found 1 product matching "${inputValue.trim()}":`;
      } else {
        botText = `I found ${products.length} products matching "${inputValue.trim()}":`;
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botText,
        sender: "bot",
        timestamp: new Date(),
        products: products.slice(0, 5), // Limit to 5 products
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error searching products:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I encountered an error while searching. Please try again.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product?query=${productId}`);
    setIsOpen(false);
  };

  const formatPrice = (price: number, discountedPrice?: number) => {
    if (discountedPrice && discountedPrice < price) {
      return (
        <div className="flex items-center gap-2">
          <span className="text-green-600 font-semibold">${discountedPrice}</span>
          <span className="text-gray-400 line-through text-sm">${price}</span>
        </div>
      );
    }
    return <span className="font-semibold">${price}</span>;
  };

  return (
    <>
      {/* Chatbot Button */}
      <div className="fixed bottom-5 left-5 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          aria-label="Open chatbot"
        >
          {isOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-20 left-5 right-5 sm:right-auto sm:w-96 h-[600px] max-h-[85vh] bg-white dark:bg-gray-800 rounded-lg shadow-2xl z-50 flex flex-col border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <h3 className="font-semibold text-lg">Shopping Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors"
              aria-label="Close chatbot"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  
                  {/* Product Cards */}
                  {message.products && message.products.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {message.products.map((product) => (
                        <div
                          key={product._id}
                          onClick={() => handleProductClick(product._id)}
                          className="bg-gray-50 dark:bg-gray-600 rounded-lg p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors border border-gray-200 dark:border-gray-500"
                        >
                          {product.thumbnailUrl && (
                            <img
                              src={product.thumbnailUrl}
                              alt={product.productName}
                              className="w-full h-32 object-cover rounded mb-2"
                            />
                          )}
                          <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-1 line-clamp-2">
                            {product.productName}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                            {product.productDescription}
                          </p>
                          <div className="flex items-center justify-between">
                            {formatPrice(product.price, product.discountedPrice)}
                            {product.ratingsAvg && (
                              <div className="flex items-center gap-1">
                                <svg
                                  className="w-4 h-4 text-yellow-400"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span className="text-xs text-gray-600 dark:text-gray-300">
                                  {product.ratingsAvg.toFixed(1)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      {message.products.length > 5 && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                          Showing 5 of {message.products.length} results
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-700 rounded-lg p-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search for products..."
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
