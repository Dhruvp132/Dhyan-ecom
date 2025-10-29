import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface CreateAddressForOrderState {
  userId: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

const initialState: CreateAddressForOrderState = {
  userId: "",
  firstName: "",
  lastName: "",
  address: "",
  city: "",
  state: "",
  zip: "",
};

export const createAddress = createAsyncThunk(
  "address/create",
  async (addressData: CreateAddressForOrderState, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: addressData?.userId,
          firstName: addressData?.firstName,
          lastName: addressData?.lastName,
          address: addressData?.address,
          city: addressData?.city,
          state: addressData?.state,
          zip: addressData?.zip,
        }),
      });
      if (!response.ok) {
        throw new Error("Address creation failed");
      }
      const address = await response.json();
      if (address.message === "Address created successfully") {
        return address;
      } else {
        rejectWithValue(address.message);
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const CreateAddressForOrderSlice = createSlice({
  name: "CreateAddressForOrder",
  initialState,
  reducers: {},
});

export default CreateAddressForOrderSlice.reducer;
