import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface wishlistItem {
  _id: string;
  productName: string;
  productDescription: string;
  discountedPrice: number;
  thumbnailUrl: string;
}

interface WishlistState {
  items: wishlistItem[];
}

// Define the initial state of the wishlist slice
const initialState: WishlistState = {
  items: [],
};

// Create the wishlist slice
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addItem: (state, action) => {
      const itemIndex = state.items.findIndex(
        (item) => item._id === action.payload._id
      );
      if (itemIndex === -1) {
        state.items.push(action.payload);
      }
    },
    removeItem: (state, action) => {
      const index = state.items.findIndex(
        (item) => item._id === action.payload._id
      );
      if (index !== -1) {
        state.items.splice(index, 1);
      }
    },
    clearWishlist: (state) => {
      state.items = [];
    },
  },
});

// Export the wishlist reducer and actions
export const { addItem, removeItem, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
