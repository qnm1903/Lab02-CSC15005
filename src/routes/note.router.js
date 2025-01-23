import express from 'express'
import NoteController from '../controllers/note.controller.js';
import authenticate from '../middlewares/auth.js';

export default class NoteRoutes {
    constructor() {
        this.router = express.Router();
        this.noteController = new NoteController();
        this.initRoute();
    }

    initRoute() {
        this.router.use('/', authenticate);
        this.router.get('/', this.noteController.getNote);
        this.router.get('/:id', this.noteController.getNote);
        this.router.get('/share/:id', this.noteController.getSharedNote);
    }

    getRouter() {
        return this.router;
    }
}