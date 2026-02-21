import { combineReducers } from "redux";
import themeReducer from "./theme/themeSlice";
import userReducer from "./user/userSlice";
import cartReducer from "./cart/cartSlice";
import wishlistReducer from "./wishlist/wishlistSlice";

const rootReducer = combineReducers({
  theme: themeReducer,
  user: userReducer,
  cart: cartReducer,
  wishlist: wishlistReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
