module.exports = function checkRole(requiredRoles) {
  return (req, res, next) => {
    try {
      // role lấy từ JWT khi user đăng nhập
      const userRole = req.user?.role;

      if (!userRole) {
        return res.status(401).json({ message: "Chưa đăng nhập hoặc token không hợp lệ" });
      }

      // Nếu userRole nằm trong danh sách được phép → next()
      if (requiredRoles.includes(userRole)) {
        return next();
      }

      return res.status(403).json({ message: "Không có quyền truy cập tài nguyên này" });
    } catch (err) {
      res.status(500).json({ message: "Lỗi kiểm tra quyền", error: err.message });
    }
  };
};
