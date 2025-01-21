import express from 'express'
import NoteController from '../controllers/note.controller.js';

export default class APIRouter {
    constructor() {
        this.router = express.Router();
        this.noteController = new NoteController();
        this.initRoute();
    }

    initRoute() {
        this.router.get('/:id', this.noteController.getNote);
        this.router.get('/share/:id', this.noteController.getSharedNote);
    }

    getRouter() {
        return this.router;
    }
}