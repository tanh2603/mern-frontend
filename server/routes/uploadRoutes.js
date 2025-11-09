const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const { uploadAvatar } = require("../controllers/uploadController");
const { verifyToken } = require("../middleware/auth"); // ✅ Đổi lại

// ✅ Chỉ cần xác thực token trước khi upload
router.post("/upload-avatar", verifyToken, upload.single("avatar"), uploadAvatar);

module.exports = router;
