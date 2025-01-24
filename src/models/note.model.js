import db from "../db/db.js";

const masterKey = Buffer.from(process.env.MASTER_KEY, 'hex');

export default class Note {
    constructor() {
        this.schema = process.env.POSTGRES_SCHEMA;
        this.tableName = 'note';
        this.db = db(this.schema);
    }

    static async createTable() {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS ${this.tableName} (
                id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                user_id SERIAL NOT NULL,
                title VARCHAR(255) NOT NULL,
                content BYTEA NOT NULL,
                salt TEXT NOT NULL,
                iv TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `

        try {
            await this.db.query(query);
            console.log(`Table "${this.tableName}" is created or already exists.`);
        } catch (err) {
            console.error(`Error creating table "${this.tableName}":`, err);
        }
    };

    getNoteByID = async (id) => {
        try {
            return await this.db.one(this.tableName, "id", id);
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    getNoteByUserID = async (user_id) => {
        try {
            return await this.db.one(this.tableName, "user_id", user_id);
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    getNotesByUserID = async (user_id) => {
        try {
            const query = `
                SELECT *
                FROM "${this.schema}"."${this.tableName}"
                WHERE "user_id" = $1
            `;
            return await this.db.native(query, [user_id]);
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    // Tạo ghi chú
    createNote = async (note) => {
        try {
            const res = await this.db.add(this.tableName, null, note);
            if (!res.success) {
                return { success: false, message: "Failed to add" };
            }
            return { success: true, message: "Added succesfully" };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    deleteNote = async (condition) => {
        try {
            const res = await this.db.delete(this.tableName, null, condition);
            if (!res.success) {
                return { success: false, message: "Failed to delete" };
            }
            return { success: true, message: "Deleted succesfully" };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
}