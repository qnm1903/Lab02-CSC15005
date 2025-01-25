import cryptoHelper from '../src/utils/cryptoHelper.js';
import crypto from 'crypto';
import fs from 'fs';
import { jest } from '@jest/globals';
import { db } from '../src/configs/pgp.config.js';
import dotenv from 'dotenv';
dotenv.config();
const { encryptFile, decryptFile, generateSessionKey} = cryptoHelper;

// Mock chỉ db.query từ pgp.config.js
jest.mock('../src/configs/pgp.config.js', () => ({
  db: {
    query: jest.fn().mockResolvedValue({
      rows: [{ salt: Buffer.from('random-salt-hex', 'hex'), 
        iv: crypto.randomBytes(12), 
        id: 'b80a1b59-f7e7-4401-9add-618848c5cf93'  // UUID giả lập 
        }],
    }),
  },
}));

describe('End-to-End Encryption Test for PDF Files', () => {
    const masterKey = Buffer.from(process.env.MASTER_KEY, 'hex'); // Khóa master từ biến môi trường
    const pdfFilePath = 'Lab02.pdf'; // Đường dẫn đến file PDF

    it('should encrypt and decrypt PDF file correctly', async () => {
        const fileBuffer = fs.readFileSync(pdfFilePath); // Đọc file PDF

        const { rows } = await db.query('SELECT salt, iv FROM note WHERE id = $1', ['b80a1b59-f7e7-4401-9add-618848c5cf93']);
        if (!rows || rows.length === 0) {
            throw new Error('No data found for the given UUID');
        }
        const { salt, iv } = rows[0]; // Lấy salt và iv từ kết quả truy vấn

        // Tạo khóa phiên từ master key và salt
        const sessionKey = generateSessionKey(masterKey, salt);

        // Mã hóa file PDF
        const { encryptedFile, authTag } = encryptFile(fileBuffer, sessionKey, iv);

        // Giải mã file PDF
        const decryptedFile = decryptFile(encryptedFile, sessionKey, iv, authTag);

        // Kiểm tra tính toàn vẹn: file giải mã phải khớp với file gốc
        expect(decryptedFile).toEqual(fileBuffer);
    });
});
