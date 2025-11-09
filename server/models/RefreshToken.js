const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const refreshTokenSchema = new Schema({
    // Liên kết với model User
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    
    // Chuỗi token (đã được ký)
    token: { 
        type: String, 
        required: true 
    },
    
    // Thời gian hết hạn của RT
    // Rất quan trọng để server biết khi nào RT không còn hợp lệ
    expiryDate: { 
        type: Date, 
        required: true 
    },
    
    // Lưu lại thời điểm tạo
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Tạo index để tìm kiếm token nhanh hơn
refreshTokenSchema.index({ token: 1 });

// (Nâng cao) Tự động xóa document khi hết hạn
// refreshTokenSchema.index({ expiryDate: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);