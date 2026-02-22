import { createBrowserRouter } from "react-router-dom";

import Error404 from "../pages/error/Error404";
import Verification from "../pages/auth/Verification";
import Login from "../pages/auth/SignIn";
import SellerLogin from "../pages/seller/SellerLogin";
import SellerPage from "../pages/seller/SellerPage";

import CheckoutLayout from "../pages/order/checkout/index";
import MetaMask from "../pages/order/checkout/MetaMask";
import StripeLayout from "../pages/order/checkout/StripeLayout";

import Profile from "../pages/profile";

import { MainLayoutRoutes } from "./MainLayoutRoutes";
import { SecuredLayoutRoutes } from "./SecuredLayoutRoutes";
import { RestrictedLayoutRoutes } from "./RestrictedLayout";
import { ProfileLayoutRoutes } from "./ProfileLayoutRoutes";

const routes = [
  MainLayoutRoutes,
  SecuredLayoutRoutes,
  RestrictedLayoutRoutes,
  ProfileLayoutRoutes,

  {
    path: "/seller-login/:email",
    element: <SellerLogin />,
  },

  {
    path: "/seller",
    element: <SellerPage />,
  },

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
    path: "profile",
    element: <Profile />,
  },

  {
    path: "*",
    element: <Error404 />,
  },
];

export default createBrowserRouter(routes);