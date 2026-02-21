import React from "react";
import useAuth from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

function withAuth(Component: React.ComponentType<any>) {
  return function AuthenticatedComponent(props: any) {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
      // Redirect the user to the login page
      return <Navigate replace to="/login" />;
    } else if (!user.verificationStatus) {
      // Redirect the user to the verification page
      return <Navigate replace to="/verification" />;
    }

    // Render the child component if the user is authenticated and verified
    return <Component {...props} />;
  };
}

export default withAuth;
