const Log = require("../models/Log");

exports.getLogs = async (req, res) => {
  try {
    const logs = await Log.find().populate("user", "name email").sort({ timestamp: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy log", error: error.message });
  }
};
