import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

export interface CreateCartProduct {
  userId: string;
  productId: string;
  quantity: number;
  color: string;
  size: string;
}

const initialState: CreateCartProduct = {
  userId: "",
  productId: "",
  quantity: 0,
  color: "",
  size: "",
};

export const AddToCart = createAsyncThunk(
  "cart/add",
  async (cartData: CreateCartProduct, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/add-to-cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: cartData?.userId,
          productId: cartData?.productId,
          quantity: cartData?.quantity,
          color: cartData?.color,
          size: cartData?.size,
        }),
      });
      if (!response.ok) {
        throw new Error("Cart creation failed");
      }
      const cart = await response.json();
      if (cart.message === "Cart item updated with new quantity") {
        toast.success("Cart item updated with new quantity");
        return cart;
      }
      if (cart.message === "New product added to cart") {
        toast.success("New product added to cart");
      } else {
        toast.error("Cart creation failed"), cart.message;
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const AddToCartSlice = createSlice({
  name: "cart/add",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(AddToCart.fulfilled, (state, action) => {
      state = action.payload;
    });
    builder.addCase(AddToCart.rejected, (state, action) => {
      console.log(action.error.message);
    });
  },
});

export default AddToCartSlice.reducer;
