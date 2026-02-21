import instance from "../../utils/Axios";

// get transaction data
export const getTickets = async () => {
  const response = await instance.get(`/admin/ticket/tickets`);
  return response.data;
};

// get ticket by id
export const getTicketById = async (id: any) => {
  const response = await instance.get(`/admin/ticket/ticketbyid/${id}`);
  return response.data;
};

// Add Message To Ticket
export const addMessageToTicket = async (id: any, message: any) => {
  const response = await instance.post(`/admin/ticket/addmessage/${id}`, {
    message,
  });
  return response.data;
};
