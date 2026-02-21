import MainLayout from "../layouts/MainLayout";
import SearchFilter from "../pages/Search/SearchFilter";
import Privacy from "../pages/conditions/privacy";
import TandC from "../pages/conditions/tandc";
import Home from "../pages/home";
import LandingPage from "../pages/landingPage";
import Overview from "../pages/product/Overview";
import ApplyAsSeller from "../pages/seller/ApplyAsSeller";
import SellerPage from "../pages/seller/SellerPage";

export const MainLayoutRoutes = {
    path: "/",
    element: <MainLayout />,
    children: [
        {
            path: "/",
            element: (
                <>
                    <LandingPage />
                </>
            ),
        },
        {
            path: "applyforseller",
            element: (
                <>
                    <ApplyAsSeller />
                </>
            ),
        },
        {
            path: "shop",
            element: (
                <>
                    <Home />
                </>
            ),
        },
        {
            path: "search",
            element: (
                <>
                    <SearchFilter />
                </>
            ),
        },
        {
            path: "product",
            element: (
                <>
                    <Overview />
                </>
            ),
        },
        {
            path: "privacypolicy",
            element: (
                <>
                    <Privacy />
                </>
            ),
        },
        {
            path: "termsandconditions",
            element: (
                <>
                    <TandC />
                </>
            ),
        },
        {
            path: "seller/:username",
            element: (
                <>
                    <SellerPage />
                </>
            ),
        },
    ],
};