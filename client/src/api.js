// src/api.js
import axios from "axios";

// 🔹 Dùng biến môi trường cho base URL
const BASE_URL = process.env.REACT_APP_API_URL;

// 🔹 Tạo instance axios với baseURL
const api = axios.create({
  baseURL: BASE_URL,
});

// 🔹 Request Interceptor: tự động thêm AccessToken vào header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 🔹 Response Interceptor: xử lý khi AccessToken hết hạn (401)
let isRefreshing = false;

api.interceptors.response.use(
  (response) => response, // Nếu request thành công
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");

      try {
        // Gọi API /auth/refresh
        const rs = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });

        const { accessToken } = rs.data;

        // Cập nhật AccessToken mới vào localStorage
        localStorage.setItem("accessToken", accessToken);

        // Cập nhật header cho axios instance
        api.defaults.headers.common["Authorization"] = "Bearer " + accessToken;
        originalRequest.headers["Authorization"] = "Bearer " + accessToken;

        isRefreshing = false;

        // Retry lại request gốc
        return api(originalRequest);
      } catch (_error) {
        console.error("Refresh token invalid, logging out...", _error);

        // Xóa token và user info
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");

        isRefreshing = false;

        // Điều hướng về trang login
        window.location.href = "/";

        return Promise.reject(_error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
