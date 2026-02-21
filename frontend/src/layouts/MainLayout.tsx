import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/rootReducer";
import instance from "../utils/Axios";
import {
  logoutSuccess,
  banRemoved,
  loginSuccess,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import IpBanned from "../pages/error/IpBanned";
import HomeLayout from "./Homelayout";
import FloatingButton from "../components/common/FloatingButton";
import Chatbot from "../components/common/Chatbot";

interface Props {
  children: React.ReactNode;
}

interface AuthenticationResponse {
  status: string;
  message: string;
}

const MainLayout = ({ children }: Props) => {
  const ban = useSelector((state: RootState) => state.user.ban);
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.user
  );

  if (ban?.status && ban?.banExpiresAt < Date.now()) {
    return <IpBanned />;
  }

  // if (ban?.banExpiresAt < Date.now() && ban?.status) {
  //   dispatch(banRemoved());
  // }

  if (isAuthenticated && !user.verificationStatus) {
    return <Navigate to="/verification" />;
  }

  return (
    <>
      <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
        <HomeLayout>
          <Outlet />
        </HomeLayout>
        <FloatingButton />
        <Chatbot />
      </div>
    </>
  );
};

export default MainLayout;
