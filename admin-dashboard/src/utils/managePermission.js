import { Navigate } from "react-router-dom";

// Define the roles and permissions for each user type
const roles = {
  accountant: {
    permissions: ["viewTransactions", "viewPayroll"],
  },
  admin: {
    permissions: ["viewUsers", "manageSellers", "manageProducts"],
  },
  superadmin: {
    permissions: ["manageUsers", "manageOrders"],
  },
  root: {
    permissions: ["manageSystem"],
  },
};

// Define a function to check if a user has a certain permission
function hasPermission(user, permission) {
  const role = user.role;
  return role && roles[role].permissions.includes(permission);
}

// Define a higher-order component to wrap protected routes
export default function ProtectedRoute({ element, user, permission }) {
  return hasPermission(user, permission) ? (
    element
  ) : (
    <Navigate to="/" replace />
  );
}
