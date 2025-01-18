import crypto from 'crypto'

const masterKey = Buffer.from(process.env.MASTER_KEY, 'hex');

// Tạo khóa phiên
function generateSessionKey() {
    return crypto.randomBytes(32);
}

const encryptSessionKey = (sessionKey, masterKey) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', masterKey, iv);
    let encrypted = cipher.update(sessionKey);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return {
        encryptedSessionKey: encrypted.toString('hex'),
        iv: iv.toString('hex'),
    };
}

const decryptSessionKey = (encryptedSessionKey, iv, masterKey) => {
    const decipher = crypto.createDecipheriv('aes-256-cbc', masterKey, Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(Buffer.from(encryptedSessionKey, 'hex'));
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted;
}

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
const encryptContent = (content, sessionKey) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', sessionKey, iv);
    let encrypted = cipher.update(content, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return {
        encryptedContent: encrypted,
        iv: iv.toString('hex'),
    };
}

// Hàm giải mã file
const decryptContent = (encryptedContent, iv, sessionKey) => {
    const decipher = crypto.createDecipheriv('aes-256-cbc', sessionKey, Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(encryptedContent, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

export default {
    generateSessionKey,
    encryptSessionKey,
    decryptSessionKey,
    encryptText, 
    decryptText,
    encryptContent,
    decryptContent
};