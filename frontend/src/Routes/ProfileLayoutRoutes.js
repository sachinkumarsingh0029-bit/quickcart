import AccountSettings from "../components/profile-ui/account/AccountSettings";
import Payments from "../components/profile-ui/payments/Payments";
import TicketConsole from "../components/profile-ui/ticket/Ticket";
import TicketDetails from "../components/profile-ui/ticket/TicketDetails";
import WishlistComponent from "../components/profile-ui/wishlist/Wishlist";
import ProfileLayout from "../layouts/ProfileLayout";
import { OrderDetails } from "../pages/order/details/orderDetails";

export const ProfileLayoutRoutes = {
    path: "/",
    element: <ProfileLayout />,
    children: [
        {
            path: "/orders",
            element: (
                <>
                    <OrderDetails />
                </>
            ),
        },
        {
            path: "/payments",
            element: (
                <>
                    <Payments />
                </>
            ),
        },
        {
            path: "/wishlist",
            element: (
                <>
                    <WishlistComponent />
                </>
            ),
        },
        {
            path: "/tickets",
            element: (
                <>
                    <TicketConsole />
                </>
            ),
        },
        {
            path: "/ticket/:id",
            element: (
                <>
                    <TicketDetails />
                </>
            ),
        },
        {
            path: "/settings",
            element: (
                <>
                    <AccountSettings />
                </>
            ),
        },
    ],
};