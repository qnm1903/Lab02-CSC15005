import Note from "../models/note.model.js";

export default class NoteController {
    constructor() {
        this.noteModel = new Note();
    }
}