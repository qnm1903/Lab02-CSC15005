import {model, Schema} from 'mongoose'
const COLLECTION_NAME = 'Notes'

const noteSchema = new Schema(
    {

    }
);

const NoteModel = model(COLLECTION_NAME, noteSchema);

export default NoteModel