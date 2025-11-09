const express = require("express");
const router = express.Router();
const { forgotPassword, resetPassword } = require("../controllers/passwordController");

// Quên mật khẩu (gửi email đặt lại)
router.post("/forgot-password", forgotPassword);

// Đặt lại mật khẩu bằng token 
router.post("/reset-password/:token", resetPassword);

module.exports = router;
