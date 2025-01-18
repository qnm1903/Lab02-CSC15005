import Note from "../models/note.model.js";
import multer from 'multer';
import v4 from 'uuid'

export default class NoteController {
    constructor() {
        this.noteModel = new Note();
    }

    getNote = async (req, res) => {

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