const fs = require('fs');
const path = require('path');

class ImageUtils {
    static async saveImageToDisk(buffer, filename) {
        const uploadDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filePath = path.join(uploadDir, filename);
        await fs.promises.writeFile(filePath, buffer);
        return `/uploads/${filename}`;
    }

    static async bufferToBase64(buffer) {
        return buffer.toString('base64');
    }

    static async base64ToBuffer(base64String) {
        return Buffer.from(base64String, 'base64');
    }

    static generateFilename(originalname) {
        const ext = path.extname(originalname);
        return `${Date.now()}${ext}`;
    }
}

module.exports = ImageUtils;