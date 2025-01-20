'use strict'

import express from 'express';
import NoteController from "../controllers/note.controller.js";
import UserController from "../controllers/user.controller.js";

export default class IndexRouter {
    constructor() {
        this.router = express.Router();
        this.noteController = new NoteController();
        this.userController = new UserController();
        this.initRoute();
    }

    initRoute() {
        this.router.get('/', this.userController.getLoginRegister);
    }

    getRouter() {
        return this.router;
    }
}