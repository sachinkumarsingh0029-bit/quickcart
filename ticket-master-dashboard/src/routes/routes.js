import { createBrowserRouter } from "react-router-dom";
import Sidebar from "../component/sidebar/Sidebar";
import MainLayout from "../Layout/MainLayout";
import Login from "../pages/login/login";
import Error404 from "../error/Error404";
import Tickets from "../pages/tickets/Tickets";
import TicketDetails from "../pages/tickets/TicketDetails";
import Assigned from "../pages/tickets/Assigned";
import Verification from "../pages/login/Verification";
const routes = [
    {
        path: "/",
        element: <MainLayout />,
        children: [
            { path: "/", element: <><Tickets /></> },
            { path: "/ticket/:id", element: <><TicketDetails /></> },
            { path: "/assigned", element: <><Assigned /></> },
        ]
    },
    // No Layout
    {
        path: "/verification",
        element: <Verification />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/error",
        element: <Error404 />,
    },
    {
        path: "*",
        element: <Error404 />,
    }
];

export default createBrowserRouter(routes);
