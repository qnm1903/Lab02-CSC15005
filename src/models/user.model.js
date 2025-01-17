import db from "../db/db.js";

export default class User {
    constructor() {
        this.schema = process.env.POSTGRES_SCHEMA;
        this.tableName = 'user';
        this.db = db(this.schema);
    }
}