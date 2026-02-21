import { useSelector } from "react-redux";
import { RootState } from "../redux/rootReducer";

// Custom hook to get authentication state from Redux store
function useAuth() {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.user
  );
  return { isAuthenticated, user };
}

export default useAuth;
