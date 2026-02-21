import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import IpBanned from "../pages/error/IpBanned";
import { loginSuccess, logoutSuccess } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/rootReducer";
import withAuth from "../hoc/withAuth";
import instance from "../utils/Axios";
import Sidebar from "../components/profile-ui/Sidebar";
import FloatingButton from "../components/common/FloatingButton";

const ProfileLayout = () => {
  const ban = useSelector((state: RootState) => state.user.ban);
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.user
  );

  const dispatch = useDispatch();

  const checkAuth = async () => {
    const response = await instance.get("/auth/check");
    console.log(response.data);
    if (response.data.status === "success") {
      dispatch(loginSuccess(response.data));
    } else {
      dispatch(logoutSuccess());
    }
  };

  useEffect(() => {
    try {
      checkAuth();
    } catch (err) {
      dispatch(logoutSuccess());
    }
  }, []);

  if (ban?.status && ban?.banExpiresAt < Date.now()) {
    return <IpBanned />;
  }
  if (isAuthenticated && !user.verificationStatus) {
    return <Navigate to="/verification" />;
  }

  return (
    <div>
      <div className="flex h-screen">
        <Sidebar />
        <span className="overflow-scroll w-full">
          <Outlet />
        </span>
        <FloatingButton />
      </div>
    </div>
  );
};

export default withAuth(ProfileLayout);
