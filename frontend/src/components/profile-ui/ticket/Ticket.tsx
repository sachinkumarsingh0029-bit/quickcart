import React, { useEffect, useState } from "react";
import { getTickets } from "../../../api/ticket";
import NewTicket from "./NewTicket";
import { useNavigate } from "react-router-dom";

const TicketConsole = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [tickets, setTickets] = useState<any>([]);
  const [newTicketModal, setNewTicketModal] = useState(false);
  const navigate = useNavigate();

  const tabs = [
    { id: "all", name: "All" },
    { id: "Open", name: "Open" },
    { id: "Pending", name: "Pending" },
    { id: "Closed", name: "Closed" },
  ];

  async function fetchData() {
    try {
      const result = await getTickets();
      setTickets(result.tickets);
    } catch (error) {}
  }

  useEffect(() => {
    fetchData();
  }, []);

  const filteredTickets =
    activeTab === "all"
      ? tickets
      : tickets.filter((ticket: any) => ticket.status === activeTab);

  const getStatusColor = (status: any) => {
    switch (status) {
      case "Open":
        return "bg-red-500";
      case "Pending":
        return "bg-yellow-500";
      case "Closed":
      case "Resolved":
      case "Completed":
      case "Approved":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="container mx-auto mt-10 p-4">
      <div className="flex justify-between items-center mb-8 relative">
        <h1 className="text-2xl font-bold text-gray-800">Help Center</h1>
        <div className="flex gap-4">
          {tickets?.length > 0 && (
            <>
              {tabs.map((tab) => (
                <>
                  <button
                    key={tab.id}
                    className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
                      activeTab === tab.id ? "bg-blue-500" : "bg-gray-500"
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.name}
                  </button>
                </>
              ))}
            </>
          )}

          <button
            className={`px-4 py-2 rounded-md text-sm font-medium text-white bg-green-500 hover:bg-green-400`}
            onClick={() => setNewTicketModal(true)}
          >
            New Ticket
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredTickets.map((ticket: any) => (
          <div
            key={ticket._id}
            className="cursor-pointer bg-white shadow-md rounded-md p-4 flex flex-col justify-between"
            onClick={() => navigate(`/ticket/${ticket._id}`)}
          >
            <div>
              <h2 className="text-lg font-medium text-gray-800">
                {ticket.subject}
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                {new Date(ticket.createdAt).toLocaleDateString()}
              </p>
              <p className="text-gray-600 mt-2">
                {ticket.description.substring(0, 25)}...
              </p>
            </div>
            <div className="mt-4">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(
                  ticket.status
                )}`}
              >
                {ticket.status.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>
      <NewTicket
        isOpen={newTicketModal}
        closeModal={() => setNewTicketModal(false)}
        fetchData={fetchData}
      />
    </div>
  );
};

export default TicketConsole;
