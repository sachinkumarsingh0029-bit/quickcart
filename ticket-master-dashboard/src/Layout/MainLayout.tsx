import React, { useEffect } from "react";
import Sidebar from "../component/sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import withAuth from "../hoc/withAuth";
import { useDispatch } from "react-redux";
import { loginSuccess, logoutSuccess } from "../redux/user/userSlice";
import instance from "../utils/Axios";

const MainLayout = () => {
  const dispatch = useDispatch();

  const checkAuth = async () => {
    const response = await instance.get("/auth/check");
    console.log(response.data);
    if (response.data.status === "success") {
      dispatch(loginSuccess(response.data));
    } else {
      dispatch(logoutSuccess());
    }
    return response;
  };

  useEffect(() => {
    const authenticate = async () => {
      try {
        await checkAuth();
      } catch (err) {}
    };
    authenticate();
  }, []);

  return (
    <div>
      <div className="flex h-screen">
        <Sidebar />
        <span className="overflow-scroll w-full">
          <Outlet />
        </span>
      </div>
    </div>
  );
};

export default withAuth(MainLayout);
