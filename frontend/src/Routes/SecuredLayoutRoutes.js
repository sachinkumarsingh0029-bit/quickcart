import SecuredLayout from "../layouts/SecuredLayout";
import { ShoppingCart } from "../pages/order/cart";
import { OrderConfirmed } from "../pages/order/confirmed";

// Secured Layout
export const SecuredLayoutRoutes = {
    path: "/",
    element: <SecuredLayout />,
    children: [
        {
            path: "order/confirmed/:cart_id",
            element: <OrderConfirmed />,
        },
        {
            path: "cart",
            element: <ShoppingCart />,
        },
    ],
}