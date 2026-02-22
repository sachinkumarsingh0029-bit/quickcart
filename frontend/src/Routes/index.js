import SellerLogin from "../pages/seller/SellerLogin";
import { createBrowserRouter } from "react-router-dom";

import Error404 from "../pages/error/Error404";
import Verification from "../pages/auth/Verification";
import Profile from "../pages/profile";
import { MainLayoutRoutes } from "./MainLayoutRoutes";
import { SecuredLayoutRoutes } from "./SecuredLayoutRoutes";
import { RestrictedLayoutRoutes } from "./RestrictedLayout";
import CheckoutLayout from "../pages/order/checkout/index";
import MetaMask from "../pages/order/checkout/MetaMask";
import StripeLayout from "../pages/order/checkout/StripeLayout";
import Login from "../pages/auth/SignIn";
import { ProfileLayoutRoutes } from "./ProfileLayoutRoutes";

const routes = [
  MainLayoutRoutes,
  SecuredLayoutRoutes,
  RestrictedLayoutRoutes,
  ProfileLayoutRoutes,

  // Profile
  {
    path: "profile",
    element: <Profile />,
  },

  // Seller OTP Login Page (🔥 VERY IMPORTANT)
  {
    path: "/seller-login/:email",
    element: <SellerLogin />,
  },

  // No Layout Routes
  {
    path: "/verification",
    element: <Verification />,
  },
  {
    path: "/checkout",
    element: <CheckoutLayout />,
  },
  {
    path: "order/checkout/metamask/:transactionId",
    element: <MetaMask />,
  },
  {
    path: "order/checkout/stripe/:transactionId",
    element: <StripeLayout />,
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