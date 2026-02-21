import instance from "../../utils/Axios";

export const signInApi = async (email: any, password: any) => {
  const response = await instance.post("/ticketmaster/login", {
    email,
    password,
  });
  return response;
};

// logout
export const logoutApi = async () => {
  const response = await instance.post("/auth/logout");
  return response;
};

// update status
export const updateStatusApi = async (id: any, data: any) => {
  const response = await instance.put(
    `/ticketmaster/ticket/${id}/update`,
    data
  );
  return response.data;
};

// ressign ticket
export const reassignTicketApi = async (id: any, data: any) => {
  const response = await instance.put(
    `/ticketmaster/ticket/${id}/reassign`,
    data
  );
  return response.data;
};

export const verifyApi = async (code: any) => {
  const response = await instance.post("/auth/verify", {
    code,
  });
  return response;
};

export const ResendVerificationMail = async () => {
  const response = await instance.post("/auth/sendVerificationCodeAgain");
  return response;
};

