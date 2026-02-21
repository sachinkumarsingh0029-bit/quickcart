import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RootState } from "../redux/rootReducer";
import { useSelector } from "react-redux";

interface UserLayoutProps {
  children: React.ReactNode;
}

const LogsLayout: React.FC<UserLayoutProps> = ({ children }) => {
  const user = useSelector((state: RootState) => state.user.user);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<any>("Users");
  const activeClass =
    "inline-flex items-center h-12 px-4 py-2 text-sm text-center text-gray-700 border border-b-0 border-gray-300 sm:text-base dark:border-gray-500 rounded-t-md dark:text-white whitespace-nowrap focus:outline-none";
  const inactiveClass =
    "inline-flex items-center h-12 px-4 py-2 text-sm text-center text-gray-700 bg-transparent border-b border-gray-300 sm:text-base dark:border-gray-500 dark:text-white whitespace-nowrap cursor-base focus:outline-none hover:border-gray-400 dark:hover:border-gray-300";

  const handleTab = () => {
    if (window.location.pathname === "/logs") {
      setActiveTab("User Logs");
    } else if (window.location.pathname === "/adminlogs") {
      setActiveTab("Admin Logs");
    } else if (window.location.pathname === "/superadminlogs") {
      setActiveTab("Super Admin Logs");
    } else if (window.location.pathname === "/errorlogs") {
      setActiveTab("Error Logs");
    } else if (window.location.pathname === "/sellerlogs") {
      setActiveTab("Seller Logs");
    } else if (window.location.pathname === "/ticketmasterlogs") {
      setActiveTab("Ticket Master Logs");
    }
  };

  useEffect(() => {
    handleTab();
  }, [window.location.pathname]);

  return (
    <div className="mt-10 p-4">
      <div className="flex overflow-x-auto whitespace-nowrap w-full">
        <button
          className={activeTab === "User Logs" ? activeClass : inactiveClass}
          onClick={() => navigate("/logs")}
        >
          User Logs
        </button>
        <button
          className={activeTab === "Seller Logs" ? activeClass : inactiveClass}
          onClick={() => navigate("/sellerlogs")}
        >
          Seller Logs
        </button>
        <button
          className={activeTab === "Ticket Master Logs" ? activeClass : inactiveClass}
          onClick={() => navigate("/ticketmasterlogs")}
        >
          Ticket Master Logs
        </button>
        <button
          className={activeTab === "Admin Logs" ? activeClass : inactiveClass}
          onClick={() => navigate("/adminlogs")}
        >
          Admin Logs
        </button>
        {user.role === "root" && (
          <>
            <button
              className={
                activeTab === "Super Admin Logs" ? activeClass : inactiveClass
              }
              onClick={() => navigate("/superadminlogs")}
            >
              SuperAdmin Logs
            </button>
          </>
        )}

        <button
          className={activeTab === "Error Logs" ? activeClass : inactiveClass}
          onClick={() => navigate("/errorlogs")}
        >
          Error Logs
        </button>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
};

export default LogsLayout;
