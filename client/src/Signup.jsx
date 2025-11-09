import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // ✅ Phải có await
      await axios.post("http://localhost:3000/api/auth/signup", {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      setMessage("✅ Đăng ký thành công!");
      // Chờ 1s rồi chuyển trang
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Lỗi đăng ký");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Đăng ký tài khoản</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Họ tên"
            className="input-field"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="input-field"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            className="input-field"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button type="submit" className="btn-submit">
            Đăng ký
          </button>
        </form>

        {message && <p style={styles.message}>{message}</p>}

        <p style={styles.footerText}>
          Đã có tài khoản?{" "}
          <Link to="/" style={styles.link}>
            Đăng nhập
          </Link>
        </p>
      </div>

      <style>{`
        .input-field {
          width: 100%;
          padding: 14px 16px;
          border: 1px solid #d1d5db;
          border-radius: 12px;
          font-size: 15px;
          outline: none;
          transition: border 0.2s ease, box-shadow 0.2s ease;
          box-sizing: border-box;
        }

        .input-field:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 5px rgba(59,130,246,0.5);
        }

        .btn-submit {
          width: 100%;
          padding: 14px 16px;
          background: linear-gradient(135deg, #4f46e5, #3b82f6);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 5px;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .btn-submit:hover {
          transform: scale(1.03);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    background: "linear-gradient(135deg, #c2e9fb 0%, #a1c4fd 100%)",
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Inter, Arial, sans-serif",
  },
  card: {
    background: "#fff",
    padding: "40px 36px",
    borderRadius: "20px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
    width: "400px",
    textAlign: "center",
  },
  title: {
    marginBottom: "25px",
    fontSize: "26px",
    fontWeight: "600",
    color: "#222",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  message: {
    color: "#16a34a",
    fontSize: "14px",
    marginTop: "10px",
  },
  footerText: {
    marginTop: "20px",
    color: "#444",
    fontSize: "14px",
  },
  link: {
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "500",
  },
};

export default Signup;
