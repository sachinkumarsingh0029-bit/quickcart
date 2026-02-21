import React, { useState } from "react";

const DateRangePicker = ({ handleChange }: any) => {
  const date = new Date();
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 2);
  const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  endOfMonth.setHours(23, 59, 59, 999);

  const [startDate, setStartDate] = useState(
    startOfMonth.toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    endOfMonth.toISOString().split("T")[0]
  );

  const handleStartDateChange = (event: any) => {
    setStartDate(event.target.value);
    handleChange({ start: event.target.value, end: endDate });
  };

  const handleEndDateChange = (event: any) => {
    setEndDate(event.target.value);
    handleChange({ start: startDate, end: event.target.value });
  };

  return (
    <div className="relative">
      <div className="flex space-x-2">
        <div className="w-1/2">
          <label
            htmlFor="start-date"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            From
          </label>
          <input
            id="start-date"
            type="date"
            name="start-date"
            value={startDate}
            onChange={handleStartDateChange}
            className="block w-full px-4 py-2 text-sm font-medium placeholder-gray-500 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:placeholder-gray-400"
          />
        </div>
        <div className="w-1/2">
          <label
            htmlFor="end-date"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            To
          </label>
          <input
            id="end-date"
            type="date"
            name="end-date"
            value={endDate}
            onChange={handleEndDateChange}
            className="block w-full px-4 py-2 text-sm font-medium placeholder-gray-500 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:placeholder-gray-400"
          />
        </div>
      </div>
    </div>
  );
};

export default DateRangePicker;
