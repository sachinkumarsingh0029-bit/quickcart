import React, { useEffect } from "react";
import SideBar from "../component/sidebar/SideBar";
import { Navigate, Outlet } from "react-router-dom";
import IpBanned from "../pages/error/IpBanned";
import { logoutSuccess } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/rootReducer";
import withAuth from "../hoc/withAuth";
import instance from "../utils/Axios";

const MainLayout = () => {
  const ban = useSelector((state: RootState) => state.user.ban);
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.user
  );
  const { seller } = useSelector((state: RootState) => state.seller);

  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await instance.get("/auth/check");

        if (response.data.status !== "success") {
          dispatch(logoutSuccess());
        }
      } catch (err) {
        dispatch(logoutSuccess());
      }
    };

    checkAuth();
  }, [dispatch]);

  if (ban?.status && ban?.banExpiresAt < Date.now()) {
    return <IpBanned />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/error" replace />;
  }

  return (
    <div className="flex h-screen">
      <SideBar />
      <div className="overflow-auto w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default withAuth(MainLayout);