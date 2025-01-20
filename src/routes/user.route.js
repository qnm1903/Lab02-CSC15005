'use strict'

import express from 'express';
import NoteController from "../controllers/note.controller.js";
import UserController from "../controllers/user.controller.js";
import authenticate from '../middlewares/auth.js';

export default class UserRouter {
    constructor() {
        this.router = express.Router();
        this.noteController = new NoteController();
        this.userController = new UserController();
        this.initRoute();
    }

    initRoute() {
        this.router.post('/login', this.userController.login);
        this.router.post('/register', this.userController.register);
        this.router.use('/', authenticate);
    }

    getRouter() {
        return this.router;
    }
}