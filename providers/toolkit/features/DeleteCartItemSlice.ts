import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

export interface DeleteCartItem {
  userId: string;
  product: {
    id: string;
  };
}
const initialState: DeleteCartItem = {
  userId: "",
  product: {
    id: "",
  },
};

export const DeleteItem = createAsyncThunk(
  "cart/delete",
  async (
    { userId, product }: { userId: string; product: { id: string } },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch("/api/delete-cart-item", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, productId: product.id }),
      });
      if (!response.ok) {
        throw new Error("Cart item deletion failed");
      }
      const cartItems = await response.json();
      if (cartItems.error) {
        toast.error(cartItems.error);
        throw new Error(cartItems.error);
      }
      console.log(cartItems);
      toast.success("Cart item deleted");
      return cartItems;
    } catch (error) {
      toast.error("Cart item deletion failed");
      return rejectWithValue(error);
    }
  }
);
export const DeleteCartItemSlice = createSlice({
  name: "cart/delete",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(DeleteItem.fulfilled, (state, action) => {
      state = action.payload;
    });
    builder.addCase(DeleteItem.rejected, (state, action) => {
      console.log(action.error.message);
    });
  },
});

export default DeleteCartItemSlice.reducer;
