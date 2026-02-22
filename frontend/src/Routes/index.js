import { createBrowserRouter } from "react-router-dom";

import Error404 from "../pages/error/Error404";
import Verification from "../pages/auth/Verification";
import Login from "../pages/auth/SignIn";
import SellerPage from "../pages/seller/SellerPage";

import { MainLayoutRoutes } from "./MainLayoutRoutes";
import { SecuredLayoutRoutes } from "./SecuredLayoutRoutes";
import { RestrictedLayoutRoutes } from "./RestrictedLayout";
import { ProfileLayoutRoutes } from "./ProfileLayoutRoutes";

const routes = [
  MainLayoutRoutes,
  SecuredLayoutRoutes,
  RestrictedLayoutRoutes,
  ProfileLayoutRoutes,

  // ✅ SELLER DASHBOARD ROUTE (VERY IMPORTANT)
  {
    path: "/seller",
    element: <SellerPage />,
  },

  {
    path: "/verification",
    element: <Verification />,
  },

  {
    path: "/signin",
    element: <Login />,
  },

  {
    path: "*",
    element: <Error404 />,
  },
];

export default createBrowserRouter(routes);