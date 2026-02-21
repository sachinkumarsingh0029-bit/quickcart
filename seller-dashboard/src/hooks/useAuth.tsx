import { useSelector } from "react-redux";
import { RootState } from "../redux/rootReducer";

// Custom hook to get authentication state from Redux store
function useAuth() {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.user
  );
  const { seller } = useSelector((state: RootState) => state.seller);
  return { isAuthenticated, user, seller };
}

export default useAuth;
