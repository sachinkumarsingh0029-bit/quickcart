import instance from "../../utils/Axios";

// GET tickets
export const getTickets = async () => {
  const response = await instance.get("/ticket");
  return response.data;
};

// GET ticket by id
export const getTicketById = async (data: any) => {
  const response = await instance.get(`/ticket/${data._id}`);
  return response.data;
};

// CREATE one ticket
export const createTicket = async (data: any) => {
  const response = await instance.post("/ticket", data);
  return response.data;
};

// add message to ticket
export const addMessage = async (data: any) => {
  const response = await instance.post("/ticket/add/message", data);
  return response.data;
};
