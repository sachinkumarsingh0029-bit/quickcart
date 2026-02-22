import React, { useEffect, useState } from "react";
import SideBar from "../component/sidebar/SideBar";
import { Navigate, Outlet } from "react-router-dom";
import IpBanned from "../pages/error/IpBanned";
import { logoutSuccess } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/rootReducer";
import instance from "../utils/Axios";

const MainLayout = (): JSX.Element => {
  const ban = useSelector((state: RootState) => state.user.ban);
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.user
  );

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await instance.get("/auth/check");

        if (response?.data?.status !== "success") {
          dispatch(logoutSuccess());
        }
      } catch (err) {
        dispatch(logoutSuccess());
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [dispatch]);

  // 🔥 FIX: Never return null (must return JSX)
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (ban?.status && ban?.banExpiresAt < Date.now()) {
    return <IpBanned />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/error" replace />;
  }

  if (user && user.verificationStatus === false) {
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

export default MainLayout;