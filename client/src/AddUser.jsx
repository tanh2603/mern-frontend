import React, { useState } from "react";
import axios from "axios";

function AddUser({ onAdd }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user"); // 🧩 Mặc định là "user"
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Tên không được để trống";
    if (!email.trim()) newErrors.email = "Email không được để trống";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email không hợp lệ";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const token = localStorage.getItem("accessToken");
    setLoading(true);
    try {
      await axios.post(
        "http://localhost:3000/users",
        {
          name,
          email,
          role,
          password: "123456",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // 🧩 gửi token JWT
          },
        }
      );


      setName("");
      setEmail("");
      setRole("user");
      setErrors({});
      onAdd();
    } catch (err) {
      console.error("Thêm user lỗi:", err);
    }
    setLoading(false);
  };

  const styles = {
    container: {
      background: "#fff",
      padding: "40px",
      margin: "40px auto",
      borderRadius: "20px",
      boxShadow: "0 12px 30px rgba(0,0,0,0.1)",
      maxWidth: "450px",
      fontFamily: "Inter, sans-serif",
    },
    title: {
      marginBottom: "25px",
      color: "#1f2937",
      fontWeight: "700",
      fontSize: "24px",
      textAlign: "center",
    },
    input: {
      width: "100%",
      height: "48px",
      padding: "0 16px",
      marginBottom: "10px",
      borderRadius: "12px",
      border: "1px solid #d1d5db",
      fontSize: "15px",
      outline: "none",
      transition: "border 0.2s ease",
      boxSizing: "border-box",
    },
    select: {
      width: "100%",
      height: "48px",
      padding: "0 12px",
      marginBottom: "10px",
      borderRadius: "12px",
      border: "1px solid #d1d5db",
      fontSize: "15px",
      outline: "none",
      backgroundColor: "#fff",
    },
    inputError: {
      border: "1px solid #ef4444",
    },
    errorText: {
      color: "#ef4444",
      fontSize: "13px",
      marginBottom: "10px",
    },
    button: {
      width: "100%",
      padding: "14px",
      background: "linear-gradient(135deg, #4f46e5, #3b82f6)",
      color: "#fff",
      border: "none",
      borderRadius: "16px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: loading ? "not-allowed" : "pointer",
      opacity: loading ? 0.7 : 1,
      marginTop: "15px",
      transition: "all 0.25s ease",
    },
  };

  return (
    <form style={styles.container} onSubmit={handleSubmit}>
      <h3 style={styles.title}>👤 Thêm người dùng mới</h3>

      <input
        type="text"
        placeholder="Tên người dùng"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ ...styles.input, ...(errors.name ? styles.inputError : {}) }}
      />
      {errors.name && <div style={styles.errorText}>{errors.name}</div>}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ ...styles.input, ...(errors.email ? styles.inputError : {}) }}
      />
      {errors.email && <div style={styles.errorText}>{errors.email}</div>}

      {/* 🧩 Thêm dropdown chọn role */}
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        style={styles.select}
      >
        <option value="user">Người dùng</option>
        <option value="moderator">Moderator</option>
        <option value="admin">Admin</option>
      </select>

      <button type="submit" style={styles.button} disabled={loading}>
        {loading ? "Đang thêm..." : "Thêm người dùng"}
      </button>
    </form>
  );
}

export default AddUser;
