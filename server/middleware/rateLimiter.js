const rateLimit = require("express-rate-limit");
const loginAttempts = new Map(); // lưu tạm theo IP

const MAX_ATTEMPTS = 5;
const BLOCK_TIME = 15 * 60 * 1000; // 15 phút

function loginLimiter(req, res, next) {
  const ip = req.ip;
  const now = Date.now();

  const record = loginAttempts.get(ip) || { count: 0, lastAttempt: 0, blockedUntil: 0 };

  // Nếu đang bị block
  if (record.blockedUntil > now) {
    const remaining = Math.ceil((record.blockedUntil - now) / 1000 / 60);
    return res.status(429).json({
      message: `Bạn đã thử quá nhiều lần. Vui lòng thử lại sau ${remaining} phút!`,
    });
  }

  req.on("loginFail", () => {
    record.count += 1;
    record.lastAttempt = now;
    if (record.count >= MAX_ATTEMPTS) {
      record.blockedUntil = now + BLOCK_TIME;
      record.count = 0;
    }
    loginAttempts.set(ip, record);
  });

  req.on("loginSuccess", () => {
    loginAttempts.delete(ip); // reset nếu login thành công
  });

  next();
}
