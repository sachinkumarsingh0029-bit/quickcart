import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getTicketById } from "../../../api/ticket";
import { addMessage } from "../../../api/ticket";

const TicketDetails = () => {
  const [message, setMessage] = useState("");
  const { id } = useParams();
  const [ticket, setTicket] = useState<any>({});
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (event: any) => {
    setMessage(event.target.value);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    // TODO: Add message to ticket
    try {
      const data = {
        id: id,
        message: message,
      };
      await addMessage(data);
      fetchData();
    } catch (error) {}
    setMessage("");
  };

  const fetchData = async () => {
    try {
      const data = {
        _id: id,
      };
      const result = await getTicketById(data);
      setTicket(result.ticket);
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 0);
    } catch (error) {}
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    JSON.stringify(ticket) !== "{}" && (
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="bg-white shadow overflow-hidden rounded-md">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Subject:- {ticket.subject}
            </h1>
            <h2 className="text-xl font-medium text-gray-900 mb-4">Details</h2>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">
                  Description
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {ticket.description}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1 text-sm text-gray-900">{ticket.status}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Priority</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {ticket.priority}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Order</dt>
                <dd className="mt-1 text-sm text-gray-900">{ticket.order}</dd>
              </div>
            </dl>
          </div>
        </div>
        <div className="bg-white shadow overflow-hidden rounded-md mt-4">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-xl font-medium text-gray-900 mb-4">Messages</h2>
            <div className="max-h-60 overflow-y-scroll">
              <ul className="divide-y divide-gray-200">
                {ticket.messages.map((message: any) => (
                  <li key={message._id} className="py-4">
                    <div className="flex space-x-3">
                      <div className="flex-1 space-y-2">
                        <div className="text-sm font-medium text-gray-900">
                          {message?.user_id?.username} - {message?.user_id?.role}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(message.time).toLocaleString()}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">{message.message}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div ref={bottomRef} />
            </div>
            <form onSubmit={handleSubmit} className="mt-8">
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700"
                >
                  Add Message
                </label>
                <div className="mt-1">
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    className="p-4 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={message}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
              </div>
              <div className="mt-5">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  );
};

export default TicketDetails;
