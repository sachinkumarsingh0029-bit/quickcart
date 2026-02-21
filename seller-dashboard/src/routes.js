import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import Products from "./pages/products/Products";
import Error404 from "./pages/error/Error404";
import OrdersTable from "./pages/orders/Orders";
import FundRelease from "./pages/funds/FundRelease";
import UpdateProfile from "./pages/Settings/UpdateProfile";
import Login from "./pages/login/Login";
import OrderDetails from "./pages/orders/OrdersDetails";
import ProductDetails from "./pages/products/ProductDetails";
import NewProduct from "./pages/products/NewProduct";
import PreviousRequests from "./pages/funds/PreviousRequests";
import Refunds from "./pages/refund/Refunds";
import RefundDetails from "./pages/refund/RefundDetails";
import Verification from "./pages/login/Verification";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                path: "/",
                element: <Dashboard />,
            },
            {
                path: "/orders",
                element: <OrdersTable />,
            },
            {
                path: "/products",
                element: <Products />,
            },
            {
                path: "/product/:id",
                element: <ProductDetails />,
            },
            {
                path: "/newproduct",
                element: <NewProduct />,
            },
            {
                path: "/request-withdrawal",
                element: <FundRelease />,
            },
            {
                path: "/funds",
                element: <PreviousRequests />,
            },
            {
                path: "/funds",
                element: <FundRelease />,
            },
            {
                path: "/profile",
                element: <UpdateProfile />,
            },
            {
                path: "/order/:orderId",
                element: <OrderDetails />,
            },
            {
                path: "/refund",
                element: <Refunds />,
            },
            {
                path: "/refund/:refundId",
                element: <RefundDetails />,
            }
        ],
    },
    {
        path: "/login/:email",
        element: <Login />,
    },
    {
        path: "/verify/:email",
        element: <Verification />,
    },
    {
        path: "error",
        element: <Error404 />,
    },
    {
        path: "*",
        element: <Error404 />,
    }
]);

export default router