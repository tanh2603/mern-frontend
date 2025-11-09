// frontend/src/UploadAvatar.jsx

import React, { useState } from "react";
// ⛔️ import axios from "axios";
import api from "./api"; // ✅ 1. Dùng instance 'api' có interceptor
import { useNavigate } from "react-router-dom"; 

function UploadAvatar() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); 

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    // Xem trước ảnh
    if (selectedFile) {
        setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setMessage("❌ Vui lòng chọn ảnh!");

    // ⛔️ 2. KHÔNG CẦN LẤY TOKEN HAY SET HEADER THỦ CÔNG
    // const token = localStorage.getItem("token"); 
    // if (!token) return setMessage("❌ Bạn chưa đăng nhập");
    // Interceptor trong 'api.js' sẽ tự động lấy 'accessToken' và đính kèm

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      // ✅ 3. Dùng 'api' và sửa đường dẫn
      // 'api.js' đã có baseURL là "http://localhost:3000/api"
      // server.js của bạn mount route này ở "/api/users"
      // Nên đường dẫn gọi chỉ cần là "/users/upload-avatar"
      const res = await api.post(
        "/users/upload-avatar", 
        formData
        // ⛔️ Không cần 'headers', axios tự set 'multipart/form-data'
        // và interceptor tự set 'Authorization'
      );
      
      setMessage("✅ " + res.data.message);
      setPreview(res.data.avatar); // Cập nhật ảnh preview bằng link cloudinary
      setFile(null); // Xóa file đã chọn

      // ✅ 4. Cập nhật lại user trong localStorage
      localStorage.setItem("user", JSON.stringify(res.data.user));

    } catch (err) {
      // Interceptor sẽ tự xử lý 401, đây là các lỗi khác (400, 500)
      setMessage("❌ " + (err.response?.data?.message || "Lỗi upload ảnh!"));
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Cập nhật ảnh đại diện</h2>

        <form onSubmit={handleUpload}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ width: "100%", boxSizing: "border-box", marginBottom: "15px" }}
          />
          {preview && <img src={preview} alt="preview" style={styles.preview} />}
          <button type="submit" style={styles.btnSubmit}>Tải lên</button>
        </form>

        {message && <p style={styles.message}>{message}</p>}

        {/* Nút quay lại */}
        <button 
          style={{ ...styles.btnSubmit, background: "#ccc", color: "#333", marginTop: "10px" }}
          onClick={() => navigate(-1)} // Dùng navigate(-1) để quay lại trang trước
        >
           Quay lại
        </button>
      </div>
    </div>
  );
}

// ... (styles giữ nguyên)
const styles = {
  container: { background: "linear-gradient(135deg,#c2e9fb,#a1c4fd)", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" },
  card: { background: "#fff", padding: "40px", borderRadius: "20px", width: "380px", textAlign: "center", boxShadow: "0 8px 25px rgba(0,0,0,0.15)" },
  title: { fontSize: "26px", marginBottom: "25px" },
  preview: { width: "120px", height: "120px", borderRadius: "50%", objectFit: "cover", margin: "15px auto" },
  message: { fontSize: "14px", marginTop: "15px" },
  btnSubmit: {
    width: "100%", padding: "12px 14px",
    background: "linear-gradient(135deg,#4facfe,#00f2fe)",
    color: "white", border: "none", borderRadius: "12px",
    fontSize: "16px", cursor: "pointer", fontWeight: "600",
    marginTop: "15px"
  }
};

export default UploadAvatar;