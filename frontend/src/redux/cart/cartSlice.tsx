import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface CartItem {
  _id: string;
  productName: string;
  productDescription: string;
  price: number;
  discountedPrice: number;
  thumbnailUrl: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalQuantity: number;
  totalAmount: number;
  totalDiscount: number;
  totalPrice: number;
}

// Define the initial state of the cart slice
const initialState: CartState = {
  items: [],
  totalPrice: 0,
  totalDiscount: 0,
  totalAmount: 0,
  totalQuantity: 0,
};

// Create the cart slice
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item._id === newItem._id);

      if (existingItem) {
        // if item already exists, update the quantity
        existingItem.quantity += newItem.quantity;
      } else {
        // add the new item to the cart
        state.items.push(newItem);
      }

      // update the total price and discount
      state.totalPrice += Math.round(newItem.price) * newItem.quantity;
      state.totalDiscount +=
        (Math.round(newItem.price) - Math.round(newItem.discountedPrice)) *
        newItem.quantity;
      state.totalQuantity += newItem.quantity;
      state.totalAmount = Math.round(state.totalPrice - state.totalDiscount);
    },
    removeItem: (state, action) => {
      const index = state.items.findIndex(
        (item) => item._id === action.payload._id
      );
      if (index !== -1) {
        const removedItem = state.items.splice(index, 1)[0];
        // update the total price and discount
        state.totalPrice -= Math.round(
          removedItem.price * removedItem.quantity
        );
        state.totalDiscount -=
          (Math.round(removedItem.price) -
            Math.round(removedItem.discountedPrice)) *
          removedItem.quantity;
        state.totalQuantity -= removedItem.quantity;
        state.totalAmount = Math.round(state.totalPrice - state.totalDiscount);
      }
      if (state.items.length === 0) {
        state.totalPrice = 0;
        state.totalDiscount = 0;
        state.totalAmount = 0;
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalPrice = 0;
      state.totalDiscount = 0;
      state.totalAmount = 0;
    },
    updateQuantity: (state, action) => {
      const { _id, quantity } = action.payload;
      const item = state.items.find((item) => item._id === _id);
      if (item) {
        // update the quantity of the item
        const diff = quantity - item.quantity;
        item.quantity = quantity;
        if (item.quantity <= 0) {
          const index = state.items.indexOf(item);
          state.items.splice(index, 1);
        }
        // update the total price and discount
        state.totalPrice += Math.round(item.price) * diff;
        state.totalDiscount +=
          (Math.round(item.price) - Math.round(item.discountedPrice)) * diff;
        state.totalQuantity += diff;
        state.totalAmount = Math.round(state.totalPrice - state.totalDiscount);
      }
    },
  },
});

// Export the cart reducer and actions
export const { addItem, removeItem, clearCart, updateQuantity } =
  cartSlice.actions;
export default cartSlice.reducer;
