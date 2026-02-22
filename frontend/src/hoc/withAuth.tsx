import React from "react";
import useAuth from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

function withAuth(Component: any) {
  return function AuthenticatedComponent(props: any) {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
      return <Navigate to="/signin" replace />;
    }

    if (!user?.verificationStatus) {
      return <Navigate to="/verification" replace />;
    }

    return <Component {...props} />;
  };
}

export default withAuth;