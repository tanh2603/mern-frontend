import React, { useEffect, useState } from "react";
import api from "./api"; 
import { useNavigate } from "react-router-dom";

function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/logs") 
      .then((res) => setLogs(res.data))
      .catch((err) => {
        console.error("Lỗi khi lấy logs:", err.message);
        if (err.response && err.response.status === 403) {
          alert("Bạn không có quyền xem trang này!");
          navigate("/dashboard");
        }
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Nút quay lại */}
        <button
          style={styles.backButton}
          onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(1)")}
          onClick={() => navigate("/dashboard")}
        >
          Quay lại Dashboard
        </button>

        <h2 style={styles.title}>Nhật ký hoạt động người dùng</h2>

        {loading ? (
          <p style={styles.loading}>Đang tải dữ liệu...</p>
        ) : logs.length === 0 ? (
          <p style={styles.noData}>Không có log hoạt động nào.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Người dùng</th>
                <th style={styles.th}>Hành động</th>
                <th style={styles.th}>Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr
                  key={log._id}
                  style={styles.tr}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f1f5f9")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <td style={styles.td}>
                    {log.user?.name || (
                      <span style={{ color: "#999" }}>
                        {log.action.includes("thất bại - email")
                          ? log.action.split("email ")[1]
                          : "Hệ thống / Ẩn danh"}
                      </span>
                    )}
                  </td>
                  <td style={styles.td}>{log.action}</td>
                  <td style={styles.td}>
                    {new Date(log.timestamp).toLocaleString("vi-VN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* 🎨 CSS in JS */
const styles = {
  container: {
    background: "linear-gradient(135deg, #c2e9fb 0%, #a1c4fd 100%)",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "40px 20px",
    fontFamily: "'Segoe UI', Roboto, sans-serif",
  },
  card: {
    background: "#fff",
    borderRadius: "20px",
    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
    padding: "30px 40px",
    width: "900px",
    maxWidth: "100%",
    transition: "all 0.3s ease",
    position: "relative",
  },
  backButton: {
    position: "absolute",
    top: "20px",
    left: "20px",
    background: "linear-gradient(to right, #2563eb, #60a5fa)",
    color: "#fff",
    border: "none",
    borderRadius: "9999px",
    padding: "10px 20px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.25s ease",
    boxShadow: "0 3px 8px rgba(37,99,235,0.3)",
  },
  title: {
    textAlign: "center",
    color: "#1e293b",
    fontSize: "26px",
    fontWeight: "700",
    marginBottom: "25px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
  },
  th: {
    background: "#2563eb",
    color: "white",
    textAlign: "left",
    padding: "14px 16px",
    fontWeight: "600",
    fontSize: "15px",
  },
  td: {
    padding: "12px 16px",
    borderBottom: "1px solid #e5e7eb",
    color: "#374151",
    fontSize: "15px",
  },
  tr: {
    transition: "background 0.2s",
  },
  loading: {
    textAlign: "center",
    color: "#2563eb",
    fontSize: "16px",
  },
  noData: {
    textAlign: "center",
    color: "#64748b",
    fontSize: "15px",
    fontStyle: "italic",
  },
};

export default AdminLogs;
