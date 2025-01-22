'use strict'

import express from 'express';
import NoteController from "../controllers/note.controller.js";
import UserController from '../controllers/user.controller.js';
import APIRoutes from './api.router.js'
import NoteRoutes from './note.router.js'

class IndexRouter {
    constructor() {
        this.router = express.Router();
        this.noteController = new NoteController();
        this.userController = new UserController();
        this.noteRoutes = new NoteRoutes();
        this.apiRoutes = new APIRoutes();
        this.initRoute();
    }

    initRoute() {
        this.router.get('/', this.userController.getLoginRegister);
        this.router.use('/api', this.apiRoutes.getRouter());
        this.router.use('/note', this.noteRoutes.getRouter());

    }

    getRouter() {
        return this.router;
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new IndexRouter();
        }

        return this.instance;
    }
}

export default IndexRouter.getInstance();