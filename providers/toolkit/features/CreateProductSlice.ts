import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

export interface ProductState {
  name: string;
  price: number;
  description: string;
  mainImage: string[];
  otherImages: string[];
  userId: string;
  categories: string;
  sizes?: string[];
  colors?: string[];
}
const initialState: ProductState = {
  name: "",
  price: 0,
  description: "",
  mainImage: [],
  otherImages: [],
  userId: "",
  categories: "",
  sizes: [],
  colors: [],
};

export const CreatePro = createAsyncThunk(
  "product/create",
  async (productData: ProductState, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/create-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: productData?.name,
          price: productData?.price,
          description: productData?.description,
          mainImage: productData?.mainImage,
          otherImages: productData?.otherImages,
          userId: productData?.userId,
          categories: {
            name: productData.categories,
          },
          sizes: productData?.sizes,
          colors: productData?.colors,
          quantity: 1,
        }),
      });
      if (!response.ok) {
        throw new Error("Product creation failed");
      }
      const product = await response.json();
      if (product.message === "Product created successfully") {
        toast.success("Product created successfully");
        return product;
      } else {
        toast.error("Product creation failed"), product.message;
      }
      throw new Error("Product creation failed");
    } catch (error) {
      toast.error("Product creation failedc" + error);
      return rejectWithValue(error);
    }
  }
);
export const CreateProductSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(CreatePro.fulfilled, (state, action) => {
      state = action.payload;
    });
    builder.addCase(CreatePro.rejected, (state, action) => {
      console.log(action.error.message);
    });
  },
});

export default CreateProductSlice.reducer;
