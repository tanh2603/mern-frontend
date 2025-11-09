const User = require("../models/User");
const bcrypt = require("bcryptjs");
const logActivity = require("../middleware/logActivity"); // ✅ Ghi log hoạt động

// ✅ GET /users -> Lấy danh sách tất cả user
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// ✅ POST /users -> Thêm user mới
const addUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập đủ name, email, password" });
    }

    const existed = await User.findOne({ email });
    if (existed) {
      return res.status(409).json({ message: "Email đã tồn tại" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    await newUser.save();

    // ✅ Ghi log (người thêm user mới)
    await logActivity(req.user?.id, `Thêm người dùng mới: ${email}`);

    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// ✅ PUT /users/:id -> Cập nhật user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    const updated = await User.findByIdAndUpdate(
      id,
      { name, email, role },
      { new: true }
    ).select("-password");

    if (!updated) {
      return res.status(404).json({ message: "Không tìm thấy user" });
    }

    // ✅ Ghi log
    await logActivity(req.user?.id, `Cập nhật thông tin người dùng: ${email || id}`);

    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// ✅ DELETE /users/:id -> Xóa user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Không tìm thấy user" });
    }

    // ✅ Ghi log
    await logActivity(req.user?.id, `Xóa người dùng: ${deleted.email}`);

    return res.status(200).json({ message: "Xóa thành công" });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

module.exports = { getUsers, addUser, updateUser, deleteUser };
