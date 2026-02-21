import { combineReducers } from "redux";
import userReducer from "./user/userSlice";
import sellerReducer from "./seller/sellerSlice";

const rootReducer = combineReducers({
  user: userReducer,
  seller: sellerReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
