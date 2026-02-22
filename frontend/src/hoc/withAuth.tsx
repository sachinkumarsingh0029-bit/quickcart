import React from "react";
import useAuth from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

const withAuth = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  const AuthenticatedComponent: React.FC<P> = (props: P) => {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
      return <Navigate to="/signin" replace />;
    }

    if (!user?.verificationStatus) {
      return <Navigate to="/verification" replace />;
    }

    return <Component {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuth;