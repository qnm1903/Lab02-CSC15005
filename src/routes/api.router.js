import express from 'express'
import NoteController from '../controllers/note.controller.js';
import authenticate from '../middlewares/auth.js';
import multer from 'multer'

// Cấu hình Multer
const upload = multer({ dest: 'uploads/' });

export default class APIRoutes {
    constructor() {
        this.router = express.Router();
        this.noteController = new NoteController();
        this.initRoute();
    }

    initRoute() {
        this.router.use(authenticate);
        this.router.post('/upload', (req, res, next) => {
            upload.single('pdfFile')(req, res, (err) => {
              if (err) {
                console.error('Multer error:', err);
                return res.status(400).send('File upload error.');
              }
              next();
            });
          }, this.noteController.createNote);
        this.router.delete('/delete-note/:id', this.noteController.deleteNote);
        this.router.post('/create-shared-note/:id', this.noteController.createSharedNote);
        this.router.delete('/delete-shared-note/:id', this.noteController.deleteSharedNote);
    }

    getRouter() {
        return this.router;
    }
}