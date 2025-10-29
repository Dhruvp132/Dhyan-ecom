import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

type User = {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
  Orders: any;
};

const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://dhyan-ecom.vercel.app/api/"
    : "http://localhost:3000/api/";

export const userAPI = createApi({
  reducerPath: "userAPI",
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    getAllUsers: builder.query<Array<User>, void>({
      query: () => "get-all-users",
    }),
    getUserById: builder.query<User, string>({
      query: (id) => `get-all-users/${id}`,
    }),
  }),
});

export const { useGetAllUsersQuery, useGetUserByIdQuery } = userAPI;
