import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { combineReducers } from "@reduxjs/toolkit";
import { UserRegisterSlice } from "../features/RegisterUserSlice";
import { CreateProductSlice } from "../features/CreateProductSlice";
import { productsApi } from "../features/GetAllProductsSlice";
import { userAPI } from "../features/GetAllUserSlice";
import { AddToCartSlice } from "../features/AddToCartSlice";
import { GetCartItemSlice } from "../features/GetUserAllCartitems";
import { DeleteCartItemSlice } from "../features/DeleteCartItemSlice";
import { CreateAddressForOrderSlice } from "../features/CreateAddressForOrderSlice";
import { GetOrdersSlice } from "../features/GetOrdersSlice";
import { GetProductsByCategorySlice } from "../features/GetProductsByCategorySlice";

// Persist config
const persistConfig = {
  key: "root",
  storage,
  // Whitelist the state slices you want to persist
  whitelist: ["cart", "cartItems", "address", "orders"],
  // Blacklist any state you don't want to persist (like API cache)
  blacklist: [productsApi.reducerPath, userAPI.reducerPath],
};

// Combine all reducers
const rootReducer = combineReducers({
  [productsApi.reducerPath]: productsApi.reducer,
  [userAPI.reducerPath]: userAPI.reducer,
  user: UserRegisterSlice.reducer,
  product: CreateProductSlice.reducer,
  cart: AddToCartSlice.reducer,
  cartItems: GetCartItemSlice.reducer,
  deleteCartItem: DeleteCartItemSlice.reducer,
  address: CreateAddressForOrderSlice.reducer,
  orders: GetOrdersSlice.reducer,
  category: GetProductsByCategorySlice.reducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          // Ignore these action types from redux-persist
          ignoredActions: [
            "persist/PERSIST",
            "persist/REHYDRATE",
            "persist/PAUSE",
            "persist/PURGE",
            "persist/REGISTER",
            "persist/FLUSH",
          ],
        },
      }).concat(productsApi.middleware, userAPI.middleware),
  });

  return store;
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

