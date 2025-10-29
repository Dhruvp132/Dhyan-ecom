import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
export const GetOrders = createAsyncThunk(
  "getOrders",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/get-orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const orders = await response.json();
      return orders?.orders;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const GetOrdersSlice = createSlice({
  name: "getOrders",
  initialState: {
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(GetOrders.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(GetOrders.fulfilled, (state, { payload }) => {
      state.orders = payload;
      state.loading = false;
    });
    builder.addCase(GetOrders.rejected, (state, { payload }) => {
      state.loading = false;
      console.log(payload);
    });
  },
});

export default GetOrdersSlice.reducer;
