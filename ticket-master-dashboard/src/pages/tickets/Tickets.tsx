import React, { useEffect, useState } from "react";
import { getAllTickets, joinTicket } from "../../api/ticket";
import { CreateToast } from "../../utils/Toast";
const Tickets = () => {
  const [tickets, setTickets] = useState([
    {
      _id: "23fds43214afa31ds",
      type: "Query",
      subject: "Need help with my order",
      order: "613a4f08d9c3d66bf034235c",
      description:
        "I received my order but it was missing an item, can you help me with that?",
      status: "Open",
      priority: "Medium",
      customer_id: "613a4d1ed9c3d66bf0342359",
      agent_id: null,
      messages: [
        {
          message: "Hello, I am having an issue with my order",
          user_id: "613a4d1ed9c3d66bf0342359",
          time: "2023-04-26T10:00:00.000Z",
        },
        {
          message: "Sure, can you give me your order number?",
          user_id: "613a4f43d9c3d66bf034235d",
          time: "2023-04-26T11:00:00.000Z",
        },
        {
          message: "Yes, my order number is 123456",
          user_id: "613a4d1ed9c3d66bf0342359",
          time: "2023-04-26T11:30:00.000Z",
        },
        {
          message: "Thank you, let me check that for you",
          user_id: "613a4f43d9c3d66bf034235d",
          time: "2023-04-26T12:00:00.000Z",
        },
      ],
      createdAt: "2023-04-26T12:00:00.000Z",
      updatedAt: "2023-04-26T12:00:00.000Z",
    },
  ]);

  const fetchTickets = async () => {
    const res = await getAllTickets();
    setTickets(res);
  };

  // fetch data
  useEffect(() => {
    fetchTickets();
  }, []);

  // handle join ticket
  const handleJoinTicket = async (ticketId: string) => {
    try {
      const result = await joinTicket(ticketId);
      if (result.status === "success") {
        CreateToast("Joinedsuccess", result.message, "success");
        fetchTickets();
      }
    } catch (error) {}
  };

  return (
    <div>
      <section className="container px-4 mx-auto">
        <div className="flex flex-col mt-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Ticket Master Dashboard
          </h1>
          <p className="text-lg text-gray-500 w-8/12 text-justify">
            Welcome to the Ticket Master dashboard. Here, you can view all the
            tickets that have been submitted by customers, and manage them
            accordingly. Use the navigation bar on the left to access different
            features of the dashboard.
          </p>
        </div>
        <div className="flex flex-col mt-4">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                      >
                        Type
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                      >
                        Subject
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                      >
                        description
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                      >
                        status
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                      >
                        priority
                      </th>
                      <th scope="col" className="relative py-3.5 px-4">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                    {tickets.map((item: any) => (
                      <tr key={item._id}>
                        <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                          {new Date(item.createdAt).toLocaleDateString(
                            "en-US",
                            { month: "long", day: "numeric", year: "numeric" }
                          )}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                          {item.type}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                          {item.subject}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                          {item.description}
                        </td>
                        <td
                          className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap"
                          style={{ wordBreak: "break-all" }}
                        >
                          {item.status}
                          <br />
                          {item.status === "Transfer to Another Agent" &&
                           `Reason:- ${item.reason}`}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300">
                          {item.priority}
                        </td>
                        <td className="px-4 py-4 text-sm whitespace-nowrap">
                          <button
                            onClick={() => handleJoinTicket(item._id)}
                            className="flex items-center gap-x-2 px-3 py-2 bg-green-500 rounded-md text-white transition-colors duration-200 hover:bg-green-600 focus:outline-none"
                          >
                            <span>Join</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Tickets;
