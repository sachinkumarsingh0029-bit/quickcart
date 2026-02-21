import instance from "../../utils/Axios";

export const signUpApi = async (email: any, password: any, username: any) => {
  const response = await instance.post("/auth/signup", {
    username,
    email,
    password,
  });
  return response;
};

export const signInApi = async (email: any, password: any) => {
  const response = await instance.post("/auth/login", {
    email,
    password,
  });
  return response;
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

// logout
export const logoutApi = async () => {
  const response = await instance.post("/auth/logout");
  return response;
};

// update profile
export const updateProfileApi = async (data: any) => {
  const response = await instance.put("/auth/updateprofile", data);
  return response;
};

// update password
export const updatePasswordApi = async (data: any) => {
  const response = await instance.put("/auth/updatepassword", data);
  return response.data;
};

// delete account
export const deleteAccountApi = async (data: any) => {
  const response = await instance.post("/auth/deleteaccount", data);
  return response.data;
};

// forgot password
export const forgotPasswordApi = async (data: any) => {
  const response = await instance.post("/auth/forgotpassword", data);
  return response.data;
};

// reset password
export const resetPasswordApi = async (data: any) => {
  const response = await instance.put("/auth/resetpassword", data);
  return response.data;
};
