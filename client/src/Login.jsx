import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginStart, loginSuccess, loginFailure } from "./redux/authSlice";
import api from "./api"; // ✅ axios instance có interceptor

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ [FIX 1] Lấy user và loading state từ Redux
  const { user, loading } = useSelector((state) => state.auth);

  // ✅ [FIX 1] Thêm Effect để tự động chuyển hướng
  useEffect(() => {
    // Nếu có user trong state, lập tức chuyển hướng
    if (user) {
      const role = user.role;
      if (role === "admin" || role === "moderator") {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/profile", { replace: true });
      }
    }
  }, [user, navigate]); // Chạy lại khi `user` thay đổi

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(loginStart());

    try {
      const res = await api.post("/auth/login", { email, password });

      // ✅ Gửi dữ liệu vào Redux store
      dispatch(
        loginSuccess({
          user: res.data.user,
          accessToken: res.data.accessToken,
          refreshToken: res.data.refreshToken,
        })
      );

      setMessage("✅ Đăng nhập thành công!");

      // setTimeout này vẫn chạy, nhưng useEffect ở trên sẽ
      // phản ứng với state `user` mới và chuyển hướng
      setTimeout(() => {
        const role = res.data.user.role;
        if (role === "admin" || role === "moderator") {
          navigate("/dashboard");
        } else {
          navigate("/profile");
        }
      }, 500);
    } catch (err) {
      const msg = err.response?.data?.message || "❌ Lỗi đăng nhập";
      setMessage(msg);
      dispatch(loginFailure(msg));
    }
  };

  // ✅ [FIX 1] Nếu đang tải hoặc user đã có, không render form
  // (Giúp tránh form nháy lên 1 cái trước khi chuyển hướng)
  if (loading || user) {
    return (
      <div style={{ textAlign: "center", marginTop: "20%" }}>
        <p>Đang xử lý...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Đăng nhập</h2>

        <form onSubmit={handleLogin} style={{ width: "100%" }}>
          {/* Email */}
          <input
            type="email"
            placeholder="Nhập email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Mật khẩu + icon con mắt */}
          <div style={styles.inputWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ paddingRight: "44px" }}
            />
            <button
              type="button"
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              onClick={() => setShowPassword((s) => !s)}
              style={styles.iconButton}
            >
              {showPassword ? (
                // Eye-off SVG
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 3l18 18"
                    stroke="#374151"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10.58 10.58a3 3 0 0 0 4.24 4.24"
                    stroke="#374151"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                // Eye SVG
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M1.5 12s4-7.5 10.5-7.5S22.5 12 22.5 12s-4 7.5-10.5 7.5S1.5 12 1.5 12z"
                    stroke="#374151"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="3"
                    stroke="#374151"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Link quên mật khẩu */}
          <div style={{ textAlign: "right", marginBottom: "15px" }}>
            <Link
              to="/forgot-password"
              style={{
                fontSize: "14px",
                color: "#007bff",
                textDecoration: "none",
              }}
            >
              Quên mật khẩu?
            </Link>
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Đang tải..." : "Đăng nhập"}
          </button>
        </form>

        {/* ✅ [FIX 2] Hiển thị thông báo (sửa lỗi ESLint) */}
        {message && (
          <p
            style={{
              color: message.includes("thành công") ? "#16a34a" : "#e74c3c",
              fontSize: "14px",
              marginTop: "12px",
              fontWeight: "500",
            }}
          >
            {message}
          </p>
        )}

        <p style={styles.footerText}>
          Chưa có tài khoản?{" "}
          <Link to="/signup" style={styles.link}>
            Đăng ký ngay
          </Link>
        </p>
      </div>

      {/* CSS nội tuyến */}
      <style>{`
        .input-field {
          width: 100%;
          padding: 14px 16px;
          margin-bottom: 15px;
          border: 1px solid #e6edf6;
          border-radius: 12px;
          outline: none;
          font-size: 15px;
          transition: 0.3s;
          box-sizing: border-box;
        }
        .input-field:focus {
          border-color: #4facfe;
          box-shadow: 0 0 6px rgba(79,172,254,0.4);
        }
        .btn-submit {
          width: 100%;
          padding: 13px 14px;
          background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          cursor: pointer;
          font-weight: 600;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn-submit:hover {
          transform: scale(1.02);
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}

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
    width: "400px",
    textAlign: "center",
  },
  title: {
    marginBottom: "20px",
    fontSize: "24px",
    fontWeight: "700",
    color: "#0f172a",
  },
  inputWrapper: {
    position: "relative",
    width: "100%",
    alignItems: "center",
    marginBottom: "10px",
  },
  iconButton: {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  footerText: {
    marginTop: "20px",
    color: "#555",
    fontSize: "14px",
  },
  link: {
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "500",
  },
};

export default Login;