// Import các thư viện cần thiết
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function ResetPassword() {
  // Lấy token từ URL (VD: /reset-password/:token)
  const { token } = useParams();

  // Các state để lưu dữ liệu form và trạng thái UI
  const [password, setPassword] = useState(""); // Mật khẩu mới
  const [showPassword, setShowPassword] = useState(false); // Hiện/ẩn mật khẩu
  const [message, setMessage] = useState(""); // Thông báo kết quả
  const [loading, setLoading] = useState(false); // Trạng thái chờ (loading)

  // Hàm xử lý khi người dùng bấm nút "Cập nhật mật khẩu"
  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn reload trang mặc định
    setLoading(true);
    setMessage("");

    try {
      // Gửi yêu cầu POST đến API backend, kèm token trong URL và mật khẩu mới
      const res = await axios.post(
        `http://localhost:3000/api/reset-password/${token}`,
        { newPassword: password } // ✅ Khớp với key mà backend mong đợi
      );

      // Nếu thành công -> hiển thị thông báo màu xanh
      setMessage(res.data.message || "✅ Mật khẩu đã được đặt lại thành công!");
    } catch (error) {
      // Nếu token sai hoặc hết hạn -> hiển thị lỗi màu đỏ
      setMessage("❌ Token không hợp lệ hoặc đã hết hạn!");
    }

    setLoading(false); // Tắt trạng thái loading
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Tiêu đề form */}
        <h2 style={styles.title}>Đặt lại mật khẩu</h2>

        {/* Form nhập mật khẩu mới */}
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          {/* Ô nhập mật khẩu có nút hiện/ẩn */}
          <div style={styles.inputWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu mới"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />

            {/* Nút hiện/ẩn mật khẩu (icon con mắt) */}
            <button
              type="button"
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              onClick={() => setShowPassword((s) => !s)}
              style={styles.iconButton}
            >
              {/* Icon SVG thay đổi theo trạng thái showPassword */}
              {showPassword ? (
                // 👁️‍🗨️ Eye-off (ẩn mật khẩu)
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 3l18 18" stroke="#374151" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10.58 10.58a3 3 0 0 0 4.24 4.24" stroke="#374151" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14.12 9.88C15.01 10.77 15.6 11.93 15.6 13.2c0 2.21-1.79 4-4 4-1.27 0-2.43-.59-3.32-1.48" stroke="#374151" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2.5 12c2.5-4.5 7-7 12-7 1.73 0 3.39.36 4.9 1.02" stroke="#374151" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21.5 12c-1.16 2.09-2.96 3.77-5.06 4.7" stroke="#374151" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                // 👁️ Eye (hiện mật khẩu)
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.5 12s4-7.5 10.5-7.5S22.5 12 22.5 12s-4 7.5-10.5 7.5S1.5 12 1.5 12z" stroke="#374151" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="12" r="3" stroke="#374151" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          </div>

          {/* Nút xác nhận đặt lại mật khẩu */}
          <button
            type="submit"
            style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
            disabled={loading}
          >
            {loading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
          </button>
        </form>

        {/* Hiển thị thông báo kết quả */}
        {message && (
          <p
            style={{
              color:
                message === "Đặt lại mật khẩu thành công!" ||
                message.includes("✅")
                  ? "#16a34a"
                  : "#dc2626",
              marginTop: "15px",
              fontWeight: "500",
              fontSize: "15px",
            }}
          >
            {message}
          </p>
        )}

        {/* Liên kết quay lại trang đăng nhập */}
        <p style={{ marginTop: "18px", fontSize: "14px" }}>
          <Link to="/" style={styles.link}>
            Quay lại đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}

// 🎨 CSS nội tuyến cho toàn bộ giao diện
const styles = {
  container: {
    height: "100vh",
    background: "linear-gradient(135deg, #c2e9fb 0%, #a1c4fd 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial, sans-serif",
    padding: "20px",
  },
  card: {
    background: "#fff",
    padding: "40px 30px",
    borderRadius: "18px",
    boxShadow: "0 10px 30px rgba(16,24,40,0.08)",
    width: "420px",
    maxWidth: "100%",
    textAlign: "center",
  },
  title: {
    marginBottom: "20px",
    fontSize: "22px",
    fontWeight: "700",
    color: "#0f172a",
  },
  inputWrapper: {
    position: "relative",
    width: "100%",
    marginBottom: "6px",
  },
  input: {
    width: "100%",
    padding: "14px 46px 14px 16px", // chừa chỗ cho icon mắt
    borderRadius: "12px",
    border: "1px solid #e6edf6",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
  },
  iconButton: {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "transparent",
    border: "none",
    padding: "6px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "8px",
  },
  button: {
    width: "100%",
    padding: "12px 14px",
    marginTop: "14px",
    background: "linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "transform 0.15s ease",
  },
  link: {
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "500",
  },
};

export default ResetPassword;
