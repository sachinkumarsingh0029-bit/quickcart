import instance from "../../utils/Axios";

// get all tickets
export const getAllTickets = async () => {
  const res = await instance.get("/ticketmaster/tickets");
  return res.data;
};

// get assigned tickets
export const getAssignedTickets = async () => {
  const res = await instance.get("/ticketmaster/tickets/assigned");
  return res.data;
};

// join ticket
export const joinTicket = async (ticketId: string) => {
  const res = await instance.post(`/ticketmaster/ticket/${ticketId}/join`);
  return res.data;
};

// get ticket by id
export const getTicketById = async (ticketId: any) => {
  const res = await instance.get(`/ticketmaster/ticket/${ticketId}`);
  return res.data;
};

// add message to ticket
export const addMessageToTicket = async (ticketId: any, message: any) => {
  const res = await instance.post(`/ticketmaster/ticket/${ticketId}/message`, {
    message,
  });
  return res.data;
};
