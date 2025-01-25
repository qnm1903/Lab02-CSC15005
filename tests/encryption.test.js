import cryptoHelper from '../src/utils/cryptoHelper.js';
import crypto from 'crypto';

const { encryptFile, decryptFile } = cryptoHelper;

describe('File Encryption/Decryption Tests', () => {
  const sessionKey = crypto.randomBytes(32); // AES-256 yêu cầu khóa 32 bytes
  const fileBuffer = Buffer.from('This is a test file content for encryption'); // Dữ liệu file giả lập

  let encryptedFile, iv, authTag;

  it('should encrypt a file correctly', () => {
    const result = encryptFile(fileBuffer, sessionKey);
    encryptedFile = result.encryptedFile;
    iv = result.iv;
    authTag = result.authTag; // Lấy authTag từ kết quả mã hóa

    // Kiểm tra các giá trị trả về
    expect(encryptedFile).toBeInstanceOf(Buffer); // Kết quả mã hóa là Buffer
    expect(iv).toBeInstanceOf(Buffer); // IV là Buffer
    expect(iv).toHaveLength(12); // IV dài 12 bytes
    expect(authTag).toBeInstanceOf(Buffer); // AuthTag là Buffer
    expect(authTag).toHaveLength(16); // AuthTag dài 16 bytes

    // Dữ liệu mã hóa không được giống dữ liệu gốc
    expect(encryptedFile.equals(fileBuffer)).toBe(false);
  });

  it('should decrypt the file correctly', () => {
    const decryptedFile = decryptFile(encryptedFile, sessionKey, iv, authTag);

    // Dữ liệu giải mã phải khớp với dữ liệu gốc
    expect(decryptedFile).toBeInstanceOf(Buffer);
    expect(decryptedFile.equals(fileBuffer)).toBe(true); // Kết quả khớp với file gốc
  });

  it('should fail decryption with incorrect session key', () => {
    const wrongKey = crypto.randomBytes(32); // Khóa không hợp lệ
    expect(() => decryptFile(encryptedFile, wrongKey, iv, authTag)).toThrow();
  });

  it('should fail decryption with incorrect IV', () => {
    const wrongIv = crypto.randomBytes(12); // IV không hợp lệ
    expect(() => decryptFile(encryptedFile, sessionKey, wrongIv, authTag)).toThrow();
  });

  it('should fail decryption with incorrect auth tag', () => {
    const wrongAuthTag = crypto.randomBytes(16); // AuthTag không hợp lệ
    expect(() => decryptFile(encryptedFile, sessionKey, iv, wrongAuthTag)).toThrow();
  });
});