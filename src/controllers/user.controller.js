import User from "../models/note.model.js";

export default class NoteController {
    constructor() {
        this.userModel = new User();
    }

    getLogin = async (req, res) => {
        try {
            res.render('login', {
                partials: "head.hbs",
            });
        } catch {
            res.send('login page');
        }
    }
}