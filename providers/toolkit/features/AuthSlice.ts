import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthUser {
  id: string;
  email?: string | null;
  name?: string | null;
  isAdmin: boolean;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  sessionStatus: "loading" | "authenticated" | "unauthenticated";
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  sessionStatus: "loading",
};

export const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthUser: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.sessionStatus = "authenticated";
    },
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.sessionStatus = "unauthenticated";
    },
    setSessionStatus: (
      state,
      action: PayloadAction<AuthState["sessionStatus"]>
    ) => {
      state.sessionStatus = action.payload;
    },
  },
});

export const { setAuthUser, clearAuth, setSessionStatus } = AuthSlice.actions;

export default AuthSlice.reducer;