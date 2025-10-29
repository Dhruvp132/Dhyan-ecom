import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface CreateCartProduct {
  userId: string;
  items: {
    data: [];
  };
}

const initialState: CreateCartProduct = {
  userId: "",
  items: {
    data: [],
  },
};

export const GetCartItems = createAsyncThunk(
  "cart/get",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/get-all-cart-items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
        }),
      });
      if (!response.ok) {
        throw new Error("Cart items fetching failed");
      }
      const cartItems = await response.json();
      return cartItems;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const GetCartItemSlice = createSlice({
  name: "cart/get",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(GetCartItems.fulfilled, (state, action) => {
      state.items = action.payload;
    });
    builder.addCase(GetCartItems.rejected, (state, action) => {
      console.log(action.error.message);
    });
  },
});

export default GetCartItemSlice.reducer;
