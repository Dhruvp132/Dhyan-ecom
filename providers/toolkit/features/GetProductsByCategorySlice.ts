import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const GetProductsByCategory = createAsyncThunk(
  "GetProductsByCategory",
  async (category: any, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/get-products-by-category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: category,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const products = await response.json();
      return products;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const GetProductsByCategorySlice = createSlice({
  name: "GetProductsByCategory",
  initialState: {
    loading: false,
    products: [],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(GetProductsByCategory.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(GetProductsByCategory.fulfilled, (state, action) => {
      state.loading = false;
      state.products = action.payload.products;
    });
    builder.addCase(GetProductsByCategory.rejected, (state, action) => {
      state.loading = false;
      console.log(action.error.message);
    });
  },
});

export default GetProductsByCategorySlice.reducer;
