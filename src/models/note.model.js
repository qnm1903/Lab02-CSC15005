import db from "../db/db.js";

export default class Note {
    constructor() {
        this.schema = process.env.POSTGRES_SCHEMA;
        this.tableName = 'note';
        this.db = db(this.schema);
    }

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
            const res = await this.db.delete(this.tableName, condition);
            if (!res.success) {
                return { success: false, message: "Failed to delete" };
            }
            return { success: true, message: "Deleted succesfully" };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
}