import Login from "../pages/auth/SignIn";
import SignUp from "../pages/auth/SignUp";
import EmptyLayout from "../layouts/EmptyLayout";
import ResetPassword from "../pages/auth/ResetPassword";

export const RestrictedLayoutRoutes =
{
    path: "/",
    element: <EmptyLayout />,
    children: [
        {
            path: "/signup",
            element: <SignUp />,
        },
        {
            path: "/resetpassword/:resetToken",
            element: <ResetPassword />,
        },
    ],
}
