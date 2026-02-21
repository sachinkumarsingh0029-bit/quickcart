import instance from "../../utils/Axios";

// get transaction data
export const getProducts = async () => {
  const response = await instance.get(`/admin/product/products`);
  return response.data;
};

// get product by id
export const getProductById = async (id: any) => {
  const response = await instance.get(`/admin/product/productbyid/${id}`);
  return response.data;
};

// update product
export const updateProduct = async (id: any, data: any) => {
  const response = await instance.put(
    `/admin/product/updateproduct/${id}`,
    data
  );
  return response.data;
};

// delete product
export const deleteProduct = async (id: any, data: any) => {
  const response = await instance.post(`/admin/product/deleteproduct/${id}`,data);
  return response.data;
};
