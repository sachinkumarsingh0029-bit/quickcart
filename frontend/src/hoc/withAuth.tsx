import React from "react";
import useAuth from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

function withAuth(Component: React.ComponentType<any>): React.FC<any> {
  const AuthenticatedComponent: React.FC<any> = (props) => {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
      return <Navigate replace to="/signin" />;
    }

    if (!user?.verificationStatus) {
      return <Navigate replace to="/verification" />;
    }

    return <Component {...props} />;
  };

  return AuthenticatedComponent;
}

export default withAuth;