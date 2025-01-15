import Note from "../models/note.model.js";

export default class NoteController {
    constructor() {
        this.noteModel = new Note();
    }

    getLogin = async (req, res) => {
        try {
            res.render('login');
        } catch {
            res.send('login page');
        }
    }
}