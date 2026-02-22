import instance from "../../utils/Axios";

/* ================= SIGNUP ================= */

export const signUpApi = async (email: any, password: any, username: any) => {
  return await instance.post("/auth/signup", {
    username,
    email,
    password,
  });
};

/* ================= LOGIN ================= */

export const signInApi = async (email: any, password: any) => {
  return await instance.post("/auth/login", {
    email,
    password,
  });
};

/* ================= VERIFY ================= */

export const verifyApi = async (code: any) => {
  return await instance.post("/auth/verify", {
    code,
  });
};

/* ================= RESEND OTP ================= */

export const ResendVerificationMail = async (email: any) => {
  return await instance.post("/auth/sendVerificationCodeAgain", {
    email,
  });
};

/* ================= LOGOUT ================= */

export const logoutApi = async () => {
  return await instance.post("/auth/logout");
};

/* ================= UPDATE PROFILE ================= */

export const updateProfileApi = async (data: any) => {
  return await instance.put("/auth/updateprofile", data);
};

/* ================= UPDATE PASSWORD ================= */

export const updatePasswordApi = async (data: any) => {
  const response = await instance.put("/auth/updatepassword", data);
  return response.data;
};

/* ================= DELETE ACCOUNT ================= */

export const deleteAccountApi = async (data: any) => {
  const response = await instance.post("/auth/deleteaccount", data);
  return response.data;
};

/* ================= FORGOT PASSWORD ================= */

export const forgotPasswordApi = async (data: any) => {
  const response = await instance.post("/auth/forgotpassword", data);
  return response.data;
};

/* ================= RESET PASSWORD ================= */

export const resetPasswordApi = async (data: any) => {
  const response = await instance.put("/auth/resetpassword", data);
  return response.data;
};