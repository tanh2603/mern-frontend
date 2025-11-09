// Middleware ghi log hoạt động người dùng
const Log = require("../models/Log");

const logActivity = async (userId, action) => {
  try {
    const log = new Log({
      user: userId,
      action,
      timestamp: new Date(),
    });
    await log.save();
  } catch (error) {
    console.error("Lỗi ghi log:", error.message);
  }
};

module.exports = logActivity;
