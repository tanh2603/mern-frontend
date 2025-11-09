import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "./api";

function Profile({ currentUser, onLogout }) {
  const [user, setUser] = useState(currentUser || null);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // 🧩 Logout
  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    try {
      if (refreshToken) {
        await api.post("/auth/logout", { refreshToken });
      }
    } catch (err) {
      console.error("Lỗi khi logout:", err);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      navigate("/");
      if (onLogout) onLogout();
    }
  };

  // 🧩 Lấy thông tin người dùng
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/profile");
        setUser(res.data);
        setForm({ name: res.data.name, email: res.data.email, password: "", confirmPassword: "" });
      } catch (error) {
        console.error("Lỗi khi lấy profile:", error);
        setMessage("Không thể tải thông tin người dùng!");
      }
    };
    fetchProfile();
  }, []);

  // 🧩 Cập nhật thông tin
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (form.password && form.password !== form.confirmPassword) {
      setMessage("Mật khẩu xác nhận không khớp!");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const updateData = { name: form.name, email: form.email };
      if (form.password) updateData.password = form.password;

      const res = await api.put("/profile", updateData);
      setUser(res.data.updatedUser);
      localStorage.setItem("user", JSON.stringify(res.data.updatedUser));
      setEditing(false);
      setMessage("✅ Cập nhật thành công!");
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      setMessage("❌ Cập nhật thất bại!");
    } finally {
      setLoading(false);
    }
  };

  // 🧩 Xóa tài khoản
  const handleDeleteAccount = async () => {
    if (!window.confirm("⚠️ Bạn có chắc chắn muốn xóa tài khoản?")) return;

    try {
      await api.delete("/profile");
      alert("Tài khoản đã bị xóa!");
      handleLogout();
    } catch (error) {
      console.error("Lỗi khi xóa tài khoản:", error);
      setMessage("❌ Xóa tài khoản thất bại!");
    }
  };

  // 🧩 Quay lại Dashboard
  const handleBackDashboard = () => {
    navigate("/dashboard");
  };

  const styles = {
    container: {
      background: "#fff",
      padding: "40px",
      margin: "40px auto",
      borderRadius: "20px",
      boxShadow: "0 12px 30px rgba(0,0,0,0.1)",
      maxWidth: "500px",
      fontFamily: "Inter, sans-serif",
      position: "relative",
    },
    topButtons: {
      position: "absolute",
      top: "20px",
      right: "20px",
      display: "flex",
      gap: "10px",
    },
    backBtn: {
      background: "linear-gradient(135deg, #10b981, #22c55e)",
      color: "#fff",
      border: "none",
      padding: "10px 18px",
      borderRadius: "14px",
      cursor: "pointer",
      fontWeight: "600",
      transition: "transform 0.2s, box-shadow 0.3s",
      boxShadow: "0 4px 12px rgba(16,185,129,0.3)",
    },
    logoutBtn: {
      background: "linear-gradient(135deg, #ef4444, #f97316)",
      color: "#fff",
      border: "none",
      padding: "10px 18px",
      borderRadius: "14px",
      cursor: "pointer",
      fontWeight: "600",
      transition: "transform 0.2s, box-shadow 0.3s",
      boxShadow: "0 4px 12px rgba(239,68,68,0.3)",
    },
    title: {
      textAlign: "center",
      fontSize: "24px",
      fontWeight: "700",
      marginBottom: "20px",
      color: "#1f2937",
    },
    avatar: {
      width: "120px",
      height: "120px",
      borderRadius: "50%",
      objectFit: "cover",
      border: "3px solid #3b82f6",
      display: "block",
      margin: "0 auto 10px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    },
    uploadLink: {
      textAlign: "center",
      marginBottom: "20px",
      fontSize: "14px",
      color: "#2563eb",
      cursor: "pointer",
      textDecoration: "none",
      display: "block",
    },
    label: {
      display: "block",
      fontWeight: "600",
      marginBottom: "6px",
      color: "#374151",
    },
    input: {
      width: "100%",
      padding: "12px 14px",
      marginBottom: "15px",
      borderRadius: "14px",
      border: "1px solid #d1d5db",
      fontSize: "15px",
      outline: "none",
      transition: "border 0.2s ease, box-shadow 0.2s ease",
      boxSizing: "border-box",
    },
    button: {
      width: "100%",
      padding: "13px",
      background: "linear-gradient(135deg, #4f46e5, #3b82f6)",
      color: "#fff",
      border: "none",
      borderRadius: "14px",
      fontSize: "15px",
      fontWeight: "600",
      cursor: "pointer",
      opacity: 1,
      marginTop: "10px",
      transition: "opacity 0.2s ease, transform 0.1s ease",
    },
    cancelBtn: {
      width: "100%",
      padding: "13px",
      background: "#9ca3af",
      color: "#fff",
      border: "none",
      borderRadius: "14px",
      fontSize: "15px",
      fontWeight: "600",
      cursor: "pointer",
      marginTop: "10px",
    },
    deleteBtn: {
      width: "100%",
      padding: "13px",
      background: "linear-gradient(135deg, #dc2626, #ef4444)",
      color: "#fff",
      border: "none",
      borderRadius: "14px",
      fontSize: "15px",
      fontWeight: "600",
      cursor: "pointer",
      marginTop: "15px",
      boxShadow: "0 4px 12px rgba(220,38,38,0.3)",
    },
    message: {
      textAlign: "center",
      marginTop: "10px",
      fontWeight: "500",
      color: "green",
    },
  };

  if (!user)
    return <p style={{ textAlign: "center", marginTop: "30px" }}>Đang tải thông tin...</p>;

  return (
    <div style={styles.container}>
      <div style={styles.topButtons}>
        {/* ✅ Chỉ admin/moderator mới thấy nút quay lại */}
        {(user.role === "admin" || user.role === "moderator") && (
          <button style={styles.backBtn} onClick={handleBackDashboard}>
            Quay lại Dashboard
          </button>
        )}
        <button style={styles.logoutBtn} onClick={handleLogout}>
          Đăng xuất
        </button>
      </div>

      <h3 style={styles.title}>Thông tin cá nhân</h3>

      <img
        src={user.avatar || "https://via.placeholder.com/120?text=No+Avatar"}
        alt="Avatar"
        style={styles.avatar}
      />

      <Link to="/upload-avatar" style={styles.uploadLink}>
        Chỉnh sửa ảnh đại diện
      </Link>

      {!editing ? (
        <div style={{ textAlign: "center" }}>
          <p><b>Họ tên:</b> {user.name}</p>
          <p><b>Email:</b> {user.email}</p>

          <button onClick={() => setEditing(true)} style={styles.button}>
            Chỉnh sửa
          </button>

          <button onClick={handleDeleteAccount} style={styles.deleteBtn}>
            Xóa tài khoản
          </button>
        </div>
      ) : (
        <form onSubmit={handleUpdate}>
          <label style={styles.label}>Họ tên</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={styles.input}
            required
          />

          <label style={styles.label}>Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={styles.input}
            required
          />

          <label style={styles.label}>Mật khẩu mới (tùy chọn)</label>
          <input
            type="password"
            placeholder="Nhập mật khẩu mới"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            style={styles.input}
          />

          <label style={styles.label}>Xác nhận mật khẩu</label>
          <input
            type="password"
            placeholder="Nhập lại mật khẩu"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            style={styles.input}
          />

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? " Đang lưu..." : "Lưu thay đổi"}
          </button>

          <button
            type="button"
            onClick={() => {
              setEditing(false);
              setForm({ ...form, password: "", confirmPassword: "" });
              setMessage("");
            }}
            style={styles.cancelBtn}
          >
            Hủy
          </button>
        </form>
      )}

      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
}

export default Profile;
