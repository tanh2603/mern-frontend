import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";

// 🔹 Lấy dữ liệu user và token từ localStorage nếu có
const persistedUser = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;
const persistedAccessToken = localStorage.getItem("accessToken");
const persistedRefreshToken = localStorage.getItem("refreshToken");

const store = configureStore({
  reducer: { auth: authReducer },
  preloadedState: {
    auth: {
      user: persistedUser,
      accessToken: persistedAccessToken,
      refreshToken: persistedRefreshToken,
      loading: false,
      error: null,
    },
  },
  devTools: true, // 🧩 Bật Redux DevTools để debug
});

// 🔹 Theo dõi state Redux -> cập nhật localStorage mỗi khi user thay đổi
store.subscribe(() => {
  const state = store.getState().auth;
  if (state.user && state.accessToken) {
    localStorage.setItem("user", JSON.stringify(state.user));
    localStorage.setItem("accessToken", state.accessToken);
    localStorage.setItem("refreshToken", state.refreshToken);
  } else {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
});

export default store;
