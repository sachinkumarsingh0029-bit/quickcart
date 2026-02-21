import React, { useEffect, useState } from "react";
import SideBar from "../component/sidebar/SideBar";
import { Navigate, Outlet } from "react-router-dom";
import Dashboard from "../pages/dashboard/Dashboard";
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
    async function checkAuth() {
      const response: any = await instance.get<any>("/auth/check");
      return response;
    }

    try {
      const response: any = checkAuth();
      if (response.data.status !== "success") {
        dispatch(logoutSuccess());
      }
    } catch (err) {
      // dispatch(logoutSuccess());
    }
  }, []);

  if (ban?.status && ban?.banExpiresAt < Date.now()) {
    return <IpBanned />;
  }

  if (!isAuthenticated && !user.verificationStatus && !seller) {
    return <Navigate to="error" />;
  } else if (isAuthenticated && !user.verificationStatus && seller) {
    return <Navigate to="error" />;
  }

  return (
    <div>
      <div className="flex h-screen">
        <SideBar />
        <span
          className="overflow-scroll w-full"
          // onClick={() => openSidebar === false && setOpenSidebar(true)}
        >
          <Outlet />
        </span>
      </div>
    </div>
  );
};

export default withAuth(MainLayout);
// export default MainLayout;
