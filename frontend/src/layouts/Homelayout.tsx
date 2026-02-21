import React, { useEffect } from "react";
import NavBar from "../components/common/NavBar";
import Footer from "../components/common/Footer";
import { Outlet } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

const HomeLayout = ({ children }: Props) => {
  return (
    <>
      <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
        <NavBar />
        <main className="flex-1 pt-10">{children}</main>
        <Footer />
      </div>
    </>
  );
};

export default HomeLayout;
