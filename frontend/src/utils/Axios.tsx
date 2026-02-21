import axios from "axios";
import HandleError from "./HandleError";
import { logoutSuccess } from "../redux/user/userSlice";
import { store } from "../redux/store";
import { CreateToast } from "./Toast";

// 🔥 Production API URL
const instance = axios.create({
  baseURL: "https://quickcart-luow.onrender.com/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    HandleError(error, () => {
      store.dispatch(logoutSuccess());
    });

    if (error.code === "ECONNABORTED") {
      CreateToast("Timeouterror", "Timeout error", "error");
    }

    if (error.code === "ERR_NETWORK") {
      CreateToast("Networkerror", "Network error", "error");
    }

    return Promise.reject(error);
  }
);

export default instance;