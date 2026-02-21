import axios from "axios";
import HandleError from "./HandleError";
import { useDispatch } from "react-redux";
import { logoutSuccess } from "../redux/user/userSlice";
import { store } from "../redux/store";
import { CreateToast } from "./Toast";
import requestIp from "request-ip";
import { request } from "http";

// # REACT_APP_API_BASE_URL=http://localhost:5500/api
// # system
// REACT_APP_API_BASE_URL=http://192.168.10.102:5500/api
// # mobile
// # ip: ipconfig | findstr "IPv4"

// Create an axios instance with default configuration (true for system, false for mobile)
const instance = axios.create({
  baseURL: true ? "http://localhost:5500/api" : "http://192.168.43.241:5500/api",
  withCredentials: true, // Send cookies with every request
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to handle HTTP requests before they are sent
instance.interceptors.request.use(
  (config) => {
    const { headers } = config;
    const clientIp = requestIp.getClientIp(config);
    console.log(clientIp);
    headers["X-Forwarded-For"] = clientIp;
    config.headers = headers;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// // Add a response interceptor to handle HTTP responses before they are returned to the application
instance.interceptors.response.use(
  (response) => {
    // Do something with the response data
    return response;
  },
  (error) => {
    HandleError(error, (error) => {
      store.dispatch(logoutSuccess());
    });
    if (error.code === "ECONNABORTED") {
      CreateToast("Timeouterror", "Timeout error", "error");
    }
    if (error.code === "ERR_NETWORK") {
      CreateToast("Networkerror", "Network error", "error");
      console.log("Network error occurred.");
    }
    console.log("Error", error);
    return Promise.reject(error);
  }
);

export default instance;
