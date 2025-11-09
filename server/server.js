// backend/server.js
require("dotenv").config(); // 🟢 Load .env ngay đầu

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const userRoutes = require("./routes/user"); // ✅ route user
const uploadRoutes = require("./routes/uploadRoutes"); // ✅ thêm upload
const passwordRoutes = require("./routes/passwordRoutes"); // ✅ thêm đổi mật khẩu
const logRoutes = require("./routes/logRoutes"); // ✅ thêm log
const { verifyToken } = require("./middleware/auth"); // nếu có xác thực

const app = express();
const PORT = process.env.PORT || 3000;

// 🟢 Đảm bảo thư mục uploads tồn tại
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("📁 Đã tạo thư mục /uploads");
}

// 🔹 Kết nối MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Kết nối MongoDB thành công!"))
  .catch((err) => {
    console.error("❌ Lỗi kết nối MongoDB:", err);
    process.exit(1); // Dừng server nếu kết nối thất bại
  });

// 🔹 Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔹 Cho phép truy cập file ảnh tĩnh (avatar, upload, v.v.)
app.use("/uploads", express.static(uploadDir));

// 🔹 Routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/users", verifyToken , userRoutes);
app.use("/api/users", uploadRoutes);
app.use("/api/", passwordRoutes);
app.use("/api", logRoutes);

// 🔹 Route kiểm tra
app.get("/", (req, res) => {
  res.send("🚀 Backend Node.js + Express + MongoDB đang chạy ổn định!");
});

// 🔹 Kiểm tra biến môi trường
console.log("🔍 Kiểm tra ENV:");
console.log({
  PORT: process.env.PORT,
  MONGO_URI: !!process.env.MONGO_URI,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "Chưa có",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? "Có" : "Không có",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? "Có" : "Không có",
});

// 🔹 Middleware xử lý lỗi toàn cục (nếu có lỗi rơi xuống đây)
app.use((err, req, res, next) => {
  console.error("🔥 Lỗi server:", err);
  res.status(500).json({ message: "Lỗi server, vui lòng thử lại sau!" });
});

// 🔹 Khởi động server
app.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại: http://localhost:${PORT}`);
});
