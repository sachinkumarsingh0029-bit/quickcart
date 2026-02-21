import { useEffect, useState } from "react";
import {
  createReviewRating,
  getReviewRating,
  orderRefundRequest,
} from "../../../api/order";
import { CreateToast } from "../../../utils/Toast";
import { ClipLoader } from "react-spinners";
import RefundRequest from "../refund/RefundRequest";

type ModalProps = {
  isOpen: boolean;
  closeModal: () => void;
  orderId: any;
};

function RefundModel({ isOpen, closeModal, orderId }: ModalProps) {
  const [cancellationReason, setCancellationReason] = useState<any>("");
  const [loading, setLoading] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    accountHolderName: "",
    accountNumber: "",
    bankName: "",
    ifscCode: "",
  });

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setBankDetails({ ...bankDetails, [name]: value });
  };

  // handle submit review
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const data = {
      orderId: orderId,
      reason: cancellationReason,
      bankDetails: bankDetails,
    };
    try {
      setLoading(true);
      const result = await orderRefundRequest(data);
      if (result.status === "success") {
        CreateToast(
          "Refundrequest",
          "Refund request submitted successfully",
          "success"
        );
        closeModal();
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex justify-center z-50">
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
              <form onSubmit={handleSubmit}>
                <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
                  <div className="relative flex-auto">
                    <label
                      htmlFor="cancellationReason"
                      className="block text-gray-700 font-bold mb-2"
                    >
                      Reason for Cancellation:
                    </label>
                    <textarea
                      id="cancellationReason"
                      name="cancellationReason"
                      className="border rounded-lg py-2 px-3 w-full resize-none"
                      rows={4}
                      value={cancellationReason}
                      onChange={(event) =>
                        setCancellationReason(event.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="my-4">
                    <label
                      htmlFor="accountHolderName"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Account Holder Name
                    </label>
                    <input
                      type="text"
                      id="accountHolderName"
                      name="accountHolderName"
                      value={bankDetails.accountHolderName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-400 rounded-lg outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="my-4">
                    <label
                      htmlFor="accountNumber"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Account Number
                    </label>
                    <input
                      type="number"
                      id="accountNumber"
                      name="accountNumber"
                      value={bankDetails.accountNumber}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-400 rounded-lg outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="my-4">
                    <label
                      htmlFor="bankName"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Bank Name
                    </label>
                    <input
                      type="text"
                      id="bankName"
                      name="bankName"
                      value={bankDetails.bankName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-400 rounded-lg outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="my-4">
                    <label
                      htmlFor="ifscCode"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      IFSC Code
                    </label>
                    <input
                      type="text"
                      id="ifscCode"
                      name="ifscCode"
                      value={bankDetails.ifscCode}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-400 rounded-lg outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="mt-5 sm:flex sm:items-center sm:justify-end">
                    <div className="sm:flex sm:items-center ">
                      <button
                        onClick={closeModal}
                        className="w-full px-4 py-2 mt-2 text-sm font-medium tracking-wide text-gray-700 capitalize transition-colors duration-300 transform border border-gray-200 rounded-md sm:mt-0 sm:w-auto sm:mx-2 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800 hover:bg-gray-100 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-40"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-4 py-2 mt-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md sm:w-auto sm:mt-0 hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
                      >
                        {!loading ? "Submit" : <ClipLoader color="#fff" />}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="fixed z-[-1] inset-0 bg-slate-400 opacity-40"></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RefundModel;
