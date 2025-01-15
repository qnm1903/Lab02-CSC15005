'use strict'

import express from 'express';
import NoteController from "../controllers/note.controller.js";

export default class IndexRouter {
    constructor() {
        this.router = express.Router();
        this.noteController = new NoteController();
        this.initRoute();
    }

    initRoute() {
        this.router.get('/', this.noteController.getLogin);
    }

    getRouter() {
        return this.router;
    }
}