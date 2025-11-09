import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

function UserList() {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({ name: "", email: "" });
  const [role, setRole] = useState("");

  useEffect(() => {
    // 🔹 Lấy role từ token khi load component
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.role);
      } catch (err) {
        console.error("Không đọc được role từ token:", err);
      }
    }

    fetchUsers();
  }, []);

  // 🔹 Hàm tải danh sách người dùng (có gửi token)
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get("http://localhost:3000/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Lỗi tải danh sách:", err.response?.data || err);
      alert("⚠️ Không thể tải danh sách người dùng. Có thể token hết hạn!");
    }
  };

  // ✅ XÓA user (chỉ admin)
  const handleDelete = async (id) => {
    if (role !== "admin") {
      alert("🚫 Bạn không có quyền xóa người dùng!");
      return;
    }

    const confirmDelete = window.confirm("⚠️ Bạn có chắc muốn xóa user này?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:3000/users/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setUsers((prevUsers) => prevUsers.filter((u) => u._id !== id));
    } catch (err) {
      console.error("Lỗi khi xóa:", err.response?.data || err);
      alert("❌ Không thể xóa user!");
    }
  };

  // ✅ Bắt đầu sửa (admin + moderator)
  const handleEdit = (user) => {
    if (role === "user") {
      alert("🚫 Bạn không có quyền chỉnh sửa!");
      return;
    }
    setEditUser(user);
    setForm({ name: user.name, email: user.email });
  };

  // ✅ Lưu cập nhật (admin + moderator)
  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        `http://localhost:3000/users/${editUser._id}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u._id === editUser._id ? res.data : u))
      );
      setEditUser(null);
    } catch (err) {
      console.error("Cập nhật lỗi:", err.response?.data || err);
      alert("❌ Không thể cập nhật user!");
    }
  };

  // ✅ Ẩn admin khỏi danh sách nếu bạn muốn
  const visibleUsers = users.filter((u) => u.role !== "admin");

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>👥 Danh sách người dùng ({role.toUpperCase()})</h2>

      <div style={styles.cardContainer}>
        {visibleUsers.length > 0 ? (
          visibleUsers.map((user) => (
            <div key={user._id} style={styles.card}>
              <h3 style={styles.name}>{user.name}</h3>
              <p style={styles.email}>{user.email}</p>
              <p style={styles.role}>
                <b>Role:</b> {user.role}
              </p>
              <div style={styles.actions}>
                {(role === "admin" || role === "moderator") && (
                  <button style={styles.editBtn} onClick={() => handleEdit(user)}>
                    Sửa
                  </button>
                )}
                {role === "admin" && (
                  <button
                    style={styles.deleteBtn}
                    onClick={() => handleDelete(user._id)}
                  >
                    Xóa
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center" }}>Không có người dùng nào.</p>
        )}
      </div>

      {editUser && (
        <div style={styles.editForm}>
          <h3 style={styles.formTitle}>Chỉnh sửa người dùng</h3>
          <input
            style={styles.input}
            type="text"
            placeholder="Tên"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          {/* 🔹 Thêm dropdown role, loại trừ admin */}
          <select
            style={styles.input}
            value={form.role || editUser.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="user">User</option>
            <option value="moderator">Moderator</option>
            {/* Không có option admin */}
          </select>
          <div>
            <button style={styles.saveBtn} onClick={handleUpdate}>
              Lưu
            </button>
            <button style={styles.cancelBtn} onClick={() => setEditUser(null)}>
              Hủy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: "30px", maxWidth: "900px", margin: "auto" },
  title: { textAlign: "center", color: "#34495e", marginBottom: "25px" },
  cardContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
  },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  name: { color: "#2c3e50", marginBottom: "5px" },
  email: { color: "#7f8c8d", fontSize: "14px" },
  role: { fontSize: "13px", color: "#555" },
  actions: { marginTop: "10px", display: "flex", justifyContent: "space-between" },
  editBtn: {
    backgroundColor: "#f1c40f",
    border: "none",
    borderRadius: "8px",
    padding: "6px 12px",
    cursor: "pointer",
    color: "#fff",
    fontWeight: "bold",
  },
  deleteBtn: {
    backgroundColor: "#e74c3c",
    border: "none",
    borderRadius: "8px",
    padding: "6px 12px",
    cursor: "pointer",
    color: "#fff",
    fontWeight: "bold",
  },
  editForm: {
    marginTop: "40px",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
    textAlign: "center",
  },
  formTitle: { color: "#2c3e50", marginBottom: "15px" },
  input: {
    display: "block",
    width: "100%",
    marginBottom: "10px",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "15px",
  },
  saveBtn: {
    backgroundColor: "#2ecc71",
    border: "none",
    borderRadius: "8px",
    padding: "8px 14px",
    marginRight: "10px",
    cursor: "pointer",
    color: "#fff",
    fontWeight: "bold",
  },
  cancelBtn: {
    backgroundColor: "#7f8c8d",
    border: "none",
    borderRadius: "8px",
    padding: "8px 14px",
    cursor: "pointer",
    color: "#fff",
    fontWeight: "bold",
  },
};

export default UserList;
