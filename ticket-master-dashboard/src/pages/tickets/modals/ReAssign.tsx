import { useEffect, useState } from "react";
import { reassignTicketApi } from "../../../api/auth";
import { useNavigate } from "react-router-dom";
import { CreateToast } from "../../../utils/Toast";

type ModalProps = {
  isOpen: boolean;
  closeModal: () => void;
  ticket: any;
};

function ReAssign({ isOpen, closeModal, ticket }: ModalProps) {
  const navigate = useNavigate();
  const [priority, setPriority] = useState<any>("Low");
  //reason
  const [reason, setReason] = useState<any>("");

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    try {
      const data = {
        priority,
        reason,
      };
      await reassignTicketApi(ticket._id, data);
      CreateToast(
        "successUpdatedTicket",
        "Ticket Updated Successfully",
        "success"
      );
      navigate("/");
      closeModal();
    } catch (error) {}
  };

  useEffect(() => {
    setPriority(ticket.priority);
  }, []);

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
              <form onSubmit={handleSubmit}>
                <div className="mt-4">
                  <label
                    htmlFor="categories"
                    className="block text-gray-700 dark:text-gray-400 font-medium mb-1"
                  >
                    Priority of Ticket
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="w-full flex-grow-0">
                      <select
                        id="categories"
                        onChange={(e) => setPriority(e.target.value)}
                        value={priority}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Urgent">Urgent</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
                  <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="taxIDNumber"
                  >
                    Reason
                  </label>
                  <input
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent py-2 px-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-50 dark:focus:ring-gray-400 dark:focus:ring-offset-gray-900"
                    type="text"
                    id="businessWebsite"
                    name="reason"
                    required
                    placeholder="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
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
                      className="w-full px-4 py-2 mt-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md sm:w-auto sm:mt-0 hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
                    >
                      Submit
                    </button>
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

export default ReAssign;
