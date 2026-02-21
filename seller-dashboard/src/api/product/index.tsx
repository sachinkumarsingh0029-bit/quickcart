import instance from "../../utils/Axios";

export const getProducts = async () => {
  const response = await instance.get("/seller/products");
  return response.data;
};

// get product by id
export const getProductById = async (id: any) => {
  const response = await instance.get(`/seller/product/${id}`);
  return response.data;
};

// update product
export const updateProduct = async (data: any) => {
  const response = await instance.put(`/seller/updateproduct`, data);
  return response;
};

// Create product
export const createProduct = async (data: any) => {
  const response = await instance.post(`/seller/createproduct`, data);
  return response.data;
};

// delete product
export const deleteProduct = async (data: any) => {
  console.log(data);
  const response = await instance.post(`/seller/deleteproduct`, data);
  return response.data;
};
