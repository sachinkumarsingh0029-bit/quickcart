import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreateToast } from "../../utils/Toast";
import { transferAmount } from "../../api/payroll";

function BankDetails({
  isOpen,
  closeModal,
  bankDetails,
  requestId,
  fetchData,
}: any) {
  // reset password
  const handleAmountTransfer = async () => {
    try {
      const result = await transferAmount(requestId);
      if (result.status === "success") {
        CreateToast("deleteuser", result.message, "success");
        closeModal();
        fetchData();
      }
    } catch (error) {}
  };

  return (
    <div className="relative flex justify-center">
      {isOpen && (
        <div
          className="fixed inset-0 z-10 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0 ">
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="relative inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl rtl:text-right dark:bg-gray-900 border-gray-800 sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6 text-black dark:text-white">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-4 my-4">
                <div className="px-4 py-5 sm:px-6">
                  <h1 className="text-2xl font-bold mb-1">Bank Details</h1>

                  <span className="text-sm font-bold mb-4">
                    Id:- {requestId}
                  </span>
                  <div className="mt-5 flex flex-col">
                    <span className="text-gray-500">Account Holder Name:</span>
                    <span>{bankDetails?.accountHolderName}</span>
                  </div>
                  <div className="mt-2 flex flex-col">
                    <span className="text-gray-500">Bank Name:</span>
                    <span>{bankDetails?.bankName}</span>
                  </div>
                  <div className="mt-2 flex flex-col">
                    <span className="text-gray-500">Account Number:</span>
                    <span>{bankDetails?.accountNumber}</span>
                  </div>
                  <div className="mt-2 flex flex-col">
                    <span className="text-gray-500">IFSC Code:</span>
                    <span>{bankDetails?.ifscCode}</span>
                  </div>
                  <div className="flex items-center justify-end mt-4">
                    <button
                      onClick={closeModal}
                      className="w-full px-4 py-2 mt-2 text-sm font-medium tracking-wide text-gray-700 capitalize transition-colors duration-300 transform border border-gray-200 rounded-md sm:mt-0 sm:w-auto sm:mx-2 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800 hover:bg-gray-100 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-40"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleAmountTransfer()}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Transfer Amount
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="fixed z-[-1] inset-0 bg-slate-400 opacity-40"></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BankDetails;
