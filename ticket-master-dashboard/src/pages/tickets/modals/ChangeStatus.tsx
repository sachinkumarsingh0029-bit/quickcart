import { useEffect, useState } from "react";
import { updateStatusApi } from "../../../api/auth";
import { CreateToast } from "../../../utils/Toast";

type ModalProps = {
  isOpen: boolean;
  closeModal: () => void;
  ticket: any;
  setTicket: any;
};

function ChangeStatus({ isOpen, closeModal, ticket, setTicket }: ModalProps) {
  const [status, setStatus] = useState<any>("Open");
  const [priority, setPriority] = useState<any>("Low");
  const [type, setType] = useState<any>("Query");

  const statusTypes = [
    "Open",
    "Pending",
    "Closed",
    "In Progress",
    "Resolved",
    "Waiting for Customer",
    "Waiting for Third Party",
    "Reopened",
    "On Hold",
    "Escalated",
    "Cancelled",
    "Deferred",
    "Duplicate",
    "Spam",
    "Not Reproducible",
    "More Information Needed",
    "In Review",
    "In Testing",
    "Completed",
    "Approved",
    "Rejected",
    "Blocked",
    "Transfer to Another Agent",
  ];

  const types = [
    "Query",
    "Complaint",
    "Support",
    "Feedback",
    "Bug Report",
    "Feature Request",
    "Account Issue",
  ];

  useEffect(() => {
    setStatus(ticket.status);
    setPriority(ticket.priority);
    setType(ticket.type);
  }, []);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    try {
      const data = {
        status,
        priority,
        type,
      };
      const response = await updateStatusApi(ticket._id, data);
      if (response.status === "success") {
        setTicket(response.ticket);
        CreateToast("successUpdated", "Status Updated Successfully", "success");
        closeModal();
      }
    } catch (error) {}
    // handle form submission
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
              <form onSubmit={handleSubmit}>
                <div className="mt-4">
                  <label
                    htmlFor="categories"
                    className="block text-gray-700 dark:text-gray-400 font-medium mb-1"
                  >
                    Status of Ticket
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="w-full flex-grow-0">
                      <select
                        id="status"
                        onChange={(e) => setStatus(e.target.value)}
                        value={status}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      >
                        {statusTypes.map((statusOption: any) => (
                          <>
                            <option key={statusOption} value={statusOption}>
                              {statusOption}
                            </option>
                          </>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
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
                <div className="mt-4">
                  <label
                    htmlFor="type"
                    className="block text-gray-700 dark:text-gray-400 font-medium mb-1"
                  >
                    Type of Ticket
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="w-full flex-grow-0">
                      <select
                        id="type"
                        onChange={(e) => setType(e.target.value)}
                        value={type}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      >
                        <option value="">Select Type</option>
                        {types.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
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

export default ChangeStatus;
