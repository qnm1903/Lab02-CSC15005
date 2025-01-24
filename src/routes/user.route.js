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
        this.router.get('/login-register', this.userController.getLoginRegister);
        this.router.post('/login', this.userController.login);
        this.router.post('/register', this.userController.register);
        this.router.get('/refresh', this.userController.refreshToken);
        this.router.post('/logout', this.userController.logout);
        this.router.use(authenticate);
        this.router.get("/profile", (req, res) => {
            res.render("profile", { user: req.user }); // Trả về trang profile với thông tin user
        });
    }

    getRouter() {
        return this.router;
    }
}