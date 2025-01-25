import Note from "../models/note.model.js";
import SharedNote from '../models/sharedNote.model.js'
import cryptoHelper from "../utils/cryptoHelper.js";
import fs from 'fs'
import crypto from 'crypto'
import { faker } from '@faker-js/faker';
import { decrypt } from "dotenv";

export default class NoteController {
    constructor() {
        this.noteModel = new Note();
        this.sharedNoteModel = new SharedNote();
    }

    getNote = async (req, res) => {
        try {
            const userID = req.user.id;
            const NotesByUserID = await this.noteModel.getNotesByUserID(userID);

            if (NotesByUserID && NotesByUserID.success === false) {
                console.log(NotesByUserID.message);
                return res.status(500).json("Internal Server Error");
            }   

            NotesByUserID.forEach( (note) => {
                // Tạo session key từ master key và salt
                const sessionKey = cryptoHelper.generateSessionKey(Buffer.from(note.salt, 'hex'));      
                note.content = cryptoHelper.decryptFile(note.content, sessionKey, Buffer.from(note.iv, 'hex'), Buffer.from(note.authtag,'hex'));
            });

            res.render('note', {
                NotesByUserID
            });
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
            const { encryptedFile, iv, authTag } = cryptoHelper.encryptFile(fileBuffer, sessionKey);
        
            // Chuẩn bị dữ liệu để thêm vào bảng Note
            const item = {
                user_id: req.user.id, // Lấy userID từ request body
                title: faker.book.title(),
                content: encryptedFile,  // Lưu file PDF đã mã hóa dưới dạng BYTEA
                salt: salt,              // Lưu salt dạng hex,
                authtag: authTag.toString('hex'),
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
        try {
            const sharedNoteByNoteID = await this.sharedNoteModel.getSharedNoteByNoteID(req.params.id);

            if (!sharedNoteByNoteID) {
                return res.status(404).render('404', { message: "Note not found" });
            }

            if (sharedNoteByNoteID) {
                const noteByNoteID = await this.noteModel.getNoteByID(req.params.id);
                const sessionKey = cryptoHelper.generateSessionKey(Buffer.from(noteByNoteID.salt, 'hex'));      
                noteByNoteID.content = cryptoHelper.decryptFile(noteByNoteID.content, sessionKey, Buffer.from(noteByNoteID.iv, 'hex'), Buffer.from(noteByNoteID.authtag,'hex'));
                res.render('share_note', {noteByNoteID});
            }
        } catch (error) {
            console.log(error.message);
            return res.status(404).render('404');
        }
    };

    deleteNote = async (req, res) => {
        const note_id = req.params.id;

        try {
            const condition = {
                column: 'id',
                value: note_id
            }

            const result = await this.noteModel.deleteNote(condition);

            res.status(201).send({ result });
        } catch (error) {
            console.error('Error deleting note:', error);
            res.status(500).send('Error deleting note.');
        }
    };

    createSharedNote = async (req, res) => {
        try {

            // Kiểm tra xem shared_note đã tồn tại chưa
            const existingSharedNote = await this.sharedNoteModel.getSharedNoteByNoteID(req.params.id);

            if (existingSharedNote) {
                // Nếu đã tồn tại, trả về thông báo
                return res.status(200).send({ existing: true, message: 'Ghi chú đã được chia sẻ', sharedNote: existingSharedNote });
            }

            // Chuẩn bị dữ liệu để thêm vào bảng Shared Note
            const item = {
                note_id: req.params.id
            };
        
            // Thêm dữ liệu vào bảng Shared Note
            const result = await this.sharedNoteModel.createSharedNote(item);
        
            res.status(201).send({ existing: false, message: 'Shared note created successfully.', result });
        } catch (error) {
            console.error('Error creating shared note:', error);
            res.status(500).send('Error creating shared note.');
        }
    };

    deleteSharedNote = async (req, res) => {
        const note_id = req.params.id;

        try {
            const condition = {
                column: 'note_id',
                value: note_id
            }

            const result = await this.sharedNoteModel.deleteSharedNote(condition);

            res.status(201).send({ message: 'Shared note deleted successfully.', result });
        } catch (error) {
            console.error('Error deleting note:', error);
            res.status(500).send('Error deleting note.');
        }
    };
}