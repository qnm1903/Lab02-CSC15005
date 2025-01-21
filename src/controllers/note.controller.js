import Note from "../models/note.model.js";

export default class NoteController {
    constructor() {
        this.noteModel = new Note();
    }

    getNote = async (req, res) => {
        try {
            res.render('note');
        } catch (error) {
            console.log(error.message);
            res.status(500).json("Internal Server Error");
        }
    };

    getSharedNote = async (req, res) => {
        
    };

    deleteNote = async (req, res) => {
        
    };

    createSharedNote = async (req, res) => {
        
    };

    deleteSharedNote = async (req, res) => {
        
    };
}