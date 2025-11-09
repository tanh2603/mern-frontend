// ✅ src/RoleRoute.jsx (Tạo file này hoặc thay thế code cũ)

import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const RoleRoute = ({ children, allowedRoles }) => {
  // 1. Dùng useSelector để lấy user (thay vì dùng prop)
  const { user } = useSelector((state) => state.auth);

  // 2. Nếu không có user, về trang login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. Nếu user.role KHÔNG nằm trong danh sách cho phép
  if (!allowedRoles.includes(user.role)) {
    // Chuyển về trang profile (an toàn hơn là trang login)
    return <Navigate to="/profile" replace />;
  }

  // 4. OK, cho phép truy cập
  return children;
};

export default RoleRoute;