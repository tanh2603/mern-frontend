const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const nodemailer = require("nodemailer");

// --- Quên mật khẩu ---
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Email không tồn tại!" });

    // Tạo token 10 phút
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "10m" });

    // Lưu token + thời hạn
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 phút
    await user.save(); // ✅ quan trọng

    console.log("Token lưu vào DB:", resetToken); // Debug

    // Gửi email thật
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    // Nội dung email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Reset mật khẩu",
      html: `<p>Click link để đặt lại mật khẩu:</p>
             <a href="${process.env.CLIENT_URL}/reset-password/${resetToken}">Đặt lại mật khẩu</a>`
    });

    res.status(200).json({ message: "Email đặt lại mật khẩu đã được gửi!" });

  } catch (error) {
    console.error("Lỗi forgotPassword:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};


// --- Reset mật khẩu ---
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded.id,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Đặt lại mật khẩu thành công!" });

  } catch (error) {
    console.error("Lỗi resetPassword:", error);
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
};
