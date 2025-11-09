// src/api.js
import axios from "axios";

const BASE_URL = "http://localhost:3000/api";

// Tạo một instance axios với cấu hình cơ sở
const api = axios.create({
  baseURL: BASE_URL,
});

// 1. Request Interceptor: Tự động đính kèm AccessToken vào header
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

// Biến cờ để theo dõi việc đang refresh token
let isRefreshing = false;

// 2. Response Interceptor: Xử lý khi AccessToken hết hạn (lỗi 401)
api.interceptors.response.use(
  (response) => {
    // Nếu request thành công, trả về response
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi là 401 VÀ request này không phải là request refresh (tránh lặp vô hạn)
    if (error.response.status === 401 && !originalRequest._retry) {
      
      if (isRefreshing) {
        // Nếu đang refresh, không thực hiện nữa mà chờ
        return Promise.reject(error);
      }

      originalRequest._retry = true; // Đánh dấu đây là request đã thử lại
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");

      try {
        // Gọi API /auth/refresh (dùng axios gốc, không dùng 'api' để tránh lặp)
        const rs = await axios.post(`${BASE_URL}/auth/refresh`, {
          refreshToken: refreshToken,
        });

        const { accessToken } = rs.data;

        // Cập nhật AT mới vào localStorage
        localStorage.setItem("accessToken", accessToken);

        // Cập nhật header cho instance 'api'
        api.defaults.headers.common["Authorization"] = "Bearer " + accessToken;
        // Cập nhật header cho request gốc
        originalRequest.headers["Authorization"] = "Bearer " + accessToken;

        isRefreshing = false;

        // Thực hiện lại request gốc với AT mới
        return api(originalRequest);

      } catch (_error) {
        // Nếu Refresh Token cũng hết hạn hoặc không hợp lệ
        console.error("Refresh token is invalid. Logging out...", _error);
        
        // Xóa hết token và user info
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        
        isRefreshing = false;
        
        // Điều hướng về trang đăng nhập
        // (Cách tốt nhất là dùng state management, nhưng window.location cũng hoạt động)
        window.location.href = "/"; 
        
        return Promise.reject(_error);
      }
    }

    // Trả về lỗi nếu không phải 401
    return Promise.reject(error);
  }
);

export default api;