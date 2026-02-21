import instance from "../../utils/Axios";

// seller verify
export const sellerVerify = async (data: any) => {
  const result = await instance.post(`/seller/verify`, data);
  return result.data;
}

export const login = async (data: any) => {
  const result = await instance.post(`/seller/login/${data.email}`, data);
  console.log(result);
  return result.data;
};

// update seller profile
export const updateSellerProfile = async (data: any) => {
  const result = await instance.put(`/seller/updateprofile`, data);
  return result.data;
};

// delete seller profile
export const deleteSellerProfile = async () => {
  const result = await instance.delete(`/seller/deleteprofile`);
  return result.data;
};

// logout
export const logoutApi = async () => {
  const response = await instance.post("/auth/logout");
  return response;
};
