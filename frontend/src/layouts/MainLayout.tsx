import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/rootReducer";
import IpBanned from "../pages/error/IpBanned";
import HomeLayout from "./Homelayout";
import FloatingButton from "../components/common/FloatingButton";
import Chatbot from "../components/common/Chatbot";

const MainLayout: React.FC = () => {
  const { isAuthenticated, user, ban } = useSelector(
    (state: RootState) => state.user
  );

  // Ban check
  if (ban?.status && ban?.banExpiresAt < Date.now()) {
    return <IpBanned />;
  }

  // Verification check
  if (isAuthenticated && !user?.verificationStatus) {
    return <Navigate to="/verification" replace />;
  }

  // ALWAYS return JSX (never null)
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      <HomeLayout>
        <Outlet />
      </HomeLayout>
      <FloatingButton />
      <Chatbot />
    </div>
  );
};

export default MainLayout;