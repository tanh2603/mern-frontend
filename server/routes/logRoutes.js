const express = require("express");
const router = express.Router();
const Log = require("../models/Log"); // Mô hình logs
const { verifyToken } = require("../middleware/auth"); // nếu có xác thực

// ✅ Lấy toàn bộ log (Admin)
router.get("/logs", verifyToken, async (req, res) => {
  try {
    const logs = await Log.find()
      .populate("user", "name email") // Hiển thị thông tin user
      .sort({ timestamp: -1 }); // Mới nhất lên đầu
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy logs", error: error.message });
  }
});

module.exports = router;
