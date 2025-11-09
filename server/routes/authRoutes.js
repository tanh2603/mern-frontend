const express = require("express");
const router = express.Router();
const { 
  signup, 
  login, 
  logout,
  refreshToken // ✅ 1. Import hàm mới
} = require("../controllers/authController");


router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refreshToken); // ✅ 2. Thêm route mới

module.exports = router;