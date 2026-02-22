import instance from "../../utils/Axios";

/* ================= SIGNUP ================= */

export const signUpApi = async (email: any, password: any, username: any) => {
  const response = await instance.post("/auth/signup", {
    username,
    email,
    password,
  });
  return response;
};

/* ================= LOGIN ================= */

export const signInApi = async (email: any, password: any) => {
  const response = await instance.post("/auth/login", {
    email,
    password,
  });
  return response;
};

/* ================= VERIFY ================= */

export const verifyApi = async (code: any) => {
  const response = await instance.post("/auth/verify", {
    code,
  });
  return response;
};

/* ================= 🔥 RESEND OTP (FIXED) ================= */

export const ResendVerificationMail = async (email: any) => {
  const response = await instance.post("/auth/sendVerificationCodeAgain", {
    email,
  });
  return response;
};

/* ================= LOGOUT ================= */

export const logoutApi = async () => {
  const response = await instance.post("/auth/logout");
  return response;
};

/* ================= UPDATE PROFILE ================= */

export const updateProfileApi = async (data: any) => {
  const response = await instance.put("/auth/updateprofile", data);
  return response;
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