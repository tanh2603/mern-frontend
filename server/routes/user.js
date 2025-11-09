const express = require("express");
const router = express.Router();

// Import controller
const {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

// Import middleware kiểm tra token + phân quyền
const { verifyToken } = require("../middleware/auth");
const checkRole = require("../middleware/checkRole");

/* =============================
   🔹 ROUTES CÓ PHÂN QUYỀN
============================= */

// 🟢 Chỉ admin hoặc moderator được xem danh sách user
router.get("/", verifyToken, checkRole(["admin", "moderator"]), getUsers);

// 🟢 Chỉ admin được thêm user mới
router.post("/", verifyToken, checkRole(["admin"]), addUser);

// 🟢 Admin và moderator được sửa user
router.put("/:id", verifyToken, checkRole(["admin", "moderator"]), updateUser);

// 🟢 Chỉ admin được xóa user
router.delete("/:id", verifyToken, checkRole(["admin"]), deleteUser);

module.exports = router;
