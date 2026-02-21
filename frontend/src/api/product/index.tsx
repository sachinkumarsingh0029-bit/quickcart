import instance from "../../utils/Axios";

export const searchProducts = async (query: string) => {
  const { data } = await instance.get(`product/search?search=${query}`);
  return data;
};

export const searchProduct = async (id: string) => {
  const { data } = await instance.get(`product/search/${id}`);
  return data;
};

export const getRecommendedProducts = async () => {
  const { data } = await instance.get("product/recommendations?limit=4");
  return data;
};

export const getTrandingProducts = async () => {
  const { data } = await instance.get("product/trending?limit=4");
  return data;
};

export const getTrandingProductsMainCategory = async () => {
  const { data } = await instance.get("product/trending?limit=2");
  return data;
};

export const getTrandingProductsThree = async () => {
  const { data } = await instance.get(
    "product/getTopProductsByDifferentFilters"
  );
  return data;
};

export const getTopProductsByTopCategorySearched = async (limit: number) => {
  const { data } = await instance.get(
    `product/getTopProductsByTopCategorySearched?limit=${limit}`
  );
  return data;
};

export const searchProductsByCategory = async (category: any) => {
  const { data } = await instance.get(`/product/search/category/${category}`);
  return data;
};

// get ratings data of product
export const getRatingsOverViewData = async (id: string) => {
  const { data } = await instance.get(`product/ratings/${id}`);
  return data;
};

// like a product
export const likeProduct = async (id: any) => {
  const response = await instance.post(`product/like/${id}`);
  return response.data;
};

// get liked product
export const getLikedProduct = async (id: any) => {
  const response = await instance.get(`product/liked/${id}`);
  return response.data;
};
