import db from "../db/db.js";

export default class Note {
    constructor() {
        this.schema = process.env.POSTGRES_SCHEMA;
        this.tableName = 'note';
        this.db = db(this.schema);
    }
}