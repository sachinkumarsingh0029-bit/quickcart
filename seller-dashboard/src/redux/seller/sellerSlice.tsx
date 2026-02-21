import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Seller {
  sellerID: string;
  businessEmail: string;
  businessNumber: string;
  businessLogo: string;
  businessName: string;
  businessUsername: string;
  businessRegistrationNumber: string;
  businessType: string;
  businessAddress: string;
  businessWebsite: string;
  taxIDNumber: string;
  paymentPreferences: string;
  blockchainWalletAddress: string;
  paypalAccountEmailAddress: string;
  productCategories: string[];
  productListings: string[];
  orders: string[];
  ratingAvg: number;
  user: string;
  createdAt: string;
  updatedAt: string;
  loginCode: string;
  loginCodeExpiresAt: string;
  verificationStatus: boolean;
  verificationCode: string;
  verificationCodeExpiresAt: string;
  banStatus: {
    isBanned: boolean;
    banExpiresAt: string;
  };
}

interface SellerState {
  seller: Seller | null;
}

const initialState: SellerState = {
  seller: null,
};

export const sellerSlice = createSlice({
  name: "seller",
  initialState,
  reducers: {
    LoginSuccess: (state, action) => {
      console.log(action.payload);
      state.seller = action.payload;
    },
    logoutSuccess: (state) => {
      state.seller = initialState.seller;
    },
  },
});

export const { LoginSuccess, logoutSuccess } = sellerSlice.actions;

export default sellerSlice.reducer;
