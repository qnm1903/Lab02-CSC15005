import Note from "../models/note.model.js";
import cryptoHelper from "../utils/cryptoHelper.js";
import fs from 'fs'
import crypto from 'crypto'

export default class NoteController {
    constructor() {
        this.noteModel = new Note();
    }

    getNote = async (req, res) => {
        try {
            res.render('note');
        } catch (error) {
            console.log(error.message);
            res.status(500).json("Internal Server Error");
        }
    };

    createNote = async (req, res) => {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }
        
        try {
            // Đọc file PDF từ request
            const fileBuffer = fs.readFileSync(req.file.path);
        
            // Tạo salt ngẫu nhiên
            const salt = crypto.randomBytes(16).toString('hex'); // Salt dạng hex
        
            // Tạo session key từ master key và salt
            const sessionKey = cryptoHelper.generateSessionKey(Buffer.from(salt, 'hex'));
        
            // Mã hóa file PDF
            const { encryptedFile, iv } = cryptoHelper.encryptFile(fileBuffer, sessionKey);
        
            // Chuẩn bị dữ liệu để thêm vào bảng Note
            const item = {
                user_id: "1", // Lấy userID từ request body
                title: "Nội dung 1",
                content: encryptedFile,  // Lưu file PDF đã mã hóa dưới dạng BYTEA
                salt: salt,              // Lưu salt dạng hex
                iv: iv.toString('hex'),  // Lưu IV dạng hex
            };
        
            // Thêm dữ liệu vào bảng Note
            const result = await this.noteModel.createNote(item);
        
            // Xóa file tạm sau khi đã lưu vào cơ sở dữ liệu
            fs.unlinkSync(req.file.path);
        
            res.status(201).send({ message: 'Note created successfully.', result });
          } catch (error) {
            console.error('Error creating note:', error);
            res.status(500).send('Error creating note.');
          }
    };

    getSharedNote = async (req, res) => {
        
    };

    deleteNote = async (req, res) => {
        
    };

    createSharedNote = async (req, res) => {
        
    };

    deleteSharedNote = async (req, res) => {
        
    };
}