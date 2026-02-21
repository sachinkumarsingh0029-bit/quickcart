import React, { useState } from "react";

const product = {
  image: "https://via.placeholder.com/150",
  name: "Sample Product",
  seller: "John Doe",
};

const RefundRequest = () => {
  const reasons = [
    "Product not as described",
    "Product arrived damaged",
    "Incorrect item received",
    "Product not received",
    "Other",
  ];

  const [seller, setSeller] = useState("");
  const [reason, setReason] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Handle form submission here
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 shadow-md rounded-md p-4 mb-4"
    >
      <div className="flex items-center mb-4">
        <img
          src={product.image}
          alt="Product"
          className="w-12 h-12 rounded-md object-cover"
        />
        <div className="ml-4">
          <h2 className="text-lg font-medium text-gray-800 dark:text-white">
            {product.name}
          </h2>
          <span className="text-gray-400 text-sm">{seller}</span>
        </div>
      </div>
      <div className="mb-4">
        <label className="text-gray-500 dark:text-gray-400 font-medium block mb-2">
          Reason for refund:
        </label>
        <select
          className="w-full p-2 border border-gray-400 rounded-md"
          onChange={(e) => setReason(e.target.value)}
        >
          <option value="">-- Select a reason --</option>
          {reasons.map((reason, index) => (
            <option value={index} key={index}>
              {reason}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="text-gray-500 dark:text-gray-400 font-medium block mb-2">
          Refund amount:
        </label>
        <input
          type="number"
          min="0"
          step="0.01"
          className="w-full p-2 border border-gray-400 rounded-md"
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="text-gray-500 dark:text-gray-400 font-medium block mb-2">
          Description:
        </label>
        <textarea
          className="w-full p-2 border border-gray-400 rounded-md"
          rows={3}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
      >
        Submit
      </button>
    </form>
  );
};

export default RefundRequest;
