import instance from "../../utils/Axios";

export const signInApi = async (email: any, password: any) => {
  const response = await instance.post("/admin/login", {
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

