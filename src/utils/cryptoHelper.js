import crypto from 'crypto'

// Tạo khóa phiên
// Hàm tạo session key từ master key
const generateSessionKey = (salt) => {
    const masterKey = Buffer.from(process.env.MASTER_KEY, 'hex');
    const sessionKey = crypto.pbkdf2Sync(masterKey, salt, 100000, 32, 'sha256'); // Tạo session key
    return sessionKey;
  };

// Hàm mã hóa text
const encryptText = (text, key, iv, mode) => {
    const cipher = crypto.createCipheriv(mode, key, iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
}

// Hàm giải mã text
const decryptText = (encryptedText, key, iv, mode) => {
    const decipher = crypto.createDecipheriv(mode, key, iv);
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
}

// Hàm mã hóa file
const encryptFile = (fileBuffer, sessionKey) => {
    // const iv = crypto.randomBytes(16); // Vector khởi tạo (IV)
    // const cipher = crypto.createCipheriv('aes-256-cbc', sessionKey, iv);
    // const encryptedFile = Buffer.concat([cipher.update(fileBuffer), cipher.final()]);
    // return { encryptedFile, iv };
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', sessionKey, iv);
    const encryptedFile = Buffer.concat([cipher.update(fileBuffer), cipher.final()]);
    const authTag = cipher.getAuthTag();
  
    return { encryptedFile, iv, authTag };
};

// Hàm giải mã file PDF bằng session key
const decryptFile = (encryptedFile, sessionKey, iv, authTag) => {
    // const decipher = crypto.createDecipheriv('aes-256-cbc', sessionKey, iv);
    // const decryptedFile = Buffer.concat([decipher.update(encryptedFile), decipher.final()]);
    // return decryptedFile;

    const decipher = crypto.createDecipheriv('aes-256-gcm', sessionKey, iv);
    decipher.setAuthTag(authTag);
    const decryptedFile = Buffer.concat([decipher.update(encryptedFile), decipher.final()]);
  
    return decryptedFile;
};

export default {
    generateSessionKey,
    encryptText, 
    decryptText,
    encryptFile,
    decryptFile
};