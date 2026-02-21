import instance from "../../utils/Axios";

// get user data
export const getSellers = async () => {
  const response = await instance.get(`/admin/seller/sellers`);
  return response.data;
};

// get seller data by id
export const getSellerById = async (id: any) => {
  const response = await instance.get(`/admin/seller/getsellerbyid/${id}`);
  return response.data;
};

// update profile
export const updateSeller = async (id: any, data: any) => {
  const response = await instance.put(`/admin/seller/updateseller/${id}`, data);
  return response.data;
};

// delete seller
export const deleteSeller = async (id: any, data: any) => {
  const response = await instance.put(`/admin/seller/deleteseller/${id}`, data);
  return response.data;
};

// ban seller
export const banSeller = async (id: any, data: any) => {
  const response = await instance.put(`/admin/seller/banseller/${id}`, data);
  return response.data;
};

// get applied sellers
export const getAppliedSellers = async () => {
  const response = await instance.get(`/admin/seller/applied-sellers`);
  return response.data;
};

// get applied seller by id
export const getAppliedSellerById = async (id: any) => {
  const response = await instance.get(`/admin/seller/applied-seller/${id}`);
  return response.data;
};

// reject seller
export const rejectSeller = async (id: any, data: any) => {
  const response = await instance.post(`/admin/seller/reject-seller/${id}`, data);
  return response.data;
}

// approve seller
export const approveSeller = async (id: any) => {
  const response = await instance.post(`/admin/seller/approve-seller/${id}`);
  return response.data;
}
