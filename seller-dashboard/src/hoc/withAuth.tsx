import React from "react";
import useAuth from "../hooks/useAuth";
import { CreateToast } from "../utils/Toast";
import { Navigate } from "react-router-dom";

// Higher-order component to check authentication before rendering child components
function withAuth(children: () => JSX.Element) {
  return function AuthenticatedComponent() {
    const { isAuthenticated, user, seller } = useAuth();

    if (isAuthenticated && user.verificationStatus && seller) {
      // Render the child components if the user is authenticated and verified
      return <>{children()}</>;
    } else if (
      isAuthenticated &&
      !user.verificationStatus &&
      seller &&
      !seller.verificationStatus
    ) {
      CreateToast(
        "verifyaccount",
        "Please verify your account to access this page.",
        "error"
      );
      // Redirect the user to the verification page
      return <Navigate replace to="/error" />;
    } else {
      CreateToast(
        "accessthispage",
        "Oops! It looks like you're not logged in. Please log in to access this page.",
        "error"
      );
      // Redirect the user to the login page
      return <Navigate replace to="/error" />;
    }
  };
}

export default withAuth;
