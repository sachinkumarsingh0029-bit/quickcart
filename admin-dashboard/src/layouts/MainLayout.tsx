import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";
import withAuth from "../hoc/withAuth";

const MainLayout = () => {
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
