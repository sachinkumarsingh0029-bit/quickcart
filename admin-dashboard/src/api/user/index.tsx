import instance from "../../utils/Axios";

// get user data
export const getUsers = async () => {
  const response = await instance.get(`/admin/user/users`);
  return response.data;
};

// get ticket masters data
export const getTicketMasters = async () => {
  const response = await instance.get(`/admin/user/ticketmasters`);
  return response.data;
};

// get user by id
export const getUser = async (id: any) => {
  const response = await instance.get(`/admin/user/userbyid/${id}`);
  return response.data;
};

// update Profile Api
export const updateProfileApi = async (id: any, data: any) => {
  const response = await instance.put(`/admin/user/updateuser/${id}`, data);
  return response.data;
};

// ban user Api
export const banUserApi = async (id: any, data: any) => {
  const response = await instance.put(`/admin/user/banuser/${id}`, data);
  return response.data;
};

// delete account
export const deleteAccountApi = async (id: any, data: any) => {
  const response = await instance.put(`/admin/user/deleteuser/${id}`, data);
  return response.data;
};

// create user
export const createUserApi = async (data: any) => {
  const response = await instance.post(`/admin/user/newuser`, data);
  return response.data;
}

// update user role
export const updateUserRoleApi = async (id: any, data: any) => {
  const response = await instance.put(`/admin/user/updaterole/${id}`, data);
  return response.data;
}