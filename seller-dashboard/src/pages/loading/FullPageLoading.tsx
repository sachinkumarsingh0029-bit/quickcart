import React from "react";
import { GridLoader } from "react-spinners";

const FullPageLoading = () => {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-white dark:bg-gray-900 flex flex-col items-center justify-center">
      <GridLoader color="#36d7b7" />
    </div>
  );
};

export default FullPageLoading;
