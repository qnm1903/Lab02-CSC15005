import express from 'express'
import NoteController from '../controllers/note.controller.js';
import authenticate from '../middlewares/auth.js';

export default class APIRouter {
    constructor() {
        this.router = express.Router();
        this.noteController = new NoteController();
        this.initRoute();
    }

    initRoute() {
        this.router.use('/', authenticate);
        this.router.post('/delete-note/:id', this.noteController.deleteNote);
        this.router.post('/create-shared-note/:id', this.noteController.createSharedNote);
        this.router.delete('/delete-shared-note/:id', this.noteController.deleteSharedNote);
    }

    getRouter() {
        return this.router;
    }
}