import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/rootReducer";
import instance from "../utils/Axios";
import { loginSuccess, logoutSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import IpBanned from "../pages/error/IpBanned";

interface Props {
  children: React.ReactNode;
}

const EmptyLayout = ({ children }: Props) => {
  const ban = useSelector((state: RootState) => state.user.ban);
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.user
  );

  if (ban?.status) {
    return <IpBanned />;
  }

  if (isAuthenticated && user.verificationStatus) {
    return <Navigate to="/shop" />;
  } else if (isAuthenticated && !user.verificationStatus) {
    return <Navigate to="/verification" />;
  }
  return (
    <>
      <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
        <Outlet />
      </div>
    </>
  );
};

export default EmptyLayout;
