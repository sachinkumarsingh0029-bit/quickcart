import instance from "../../utils/Axios";

export const getSellerProfileAndProducts = async ({ username }: any) => {
  const { data } = await instance.get(`product/seller/${username}`);
  return data;
};

// apply for seller
export const applyForSeller = async (data: any) => {
  const response = await instance.post("/seller/apply", data);
  return response.data;
};
