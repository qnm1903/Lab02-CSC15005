import db from "../db/db.js";

export default class SharedNote {
    constructor() {
        this.schema = process.env.POSTGRES_SCHEMA;
        this.tableName = 'shared_note';
        this.db = db(this.schema);
    }

    getSharedNoteByID = async (id) => {
        try {
            return await this.db.one(this.tableName, "id", id);
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    getSharedNoteByNoteID = async (note_id) => {
        try {
            return await this.db.one(this.tableName, "note_id", note_id);
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    // Tạo ghi chú
    createSharedNote = async (shared_note) => {
        try {
            const res = await this.db.add(this.tableName, null, shared_note);
            if (!res.success) {
                return { success: false, message: "Failed to add" };
            }
            return { success: true, message: "Added succesfully" };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    deleteSharedNote = async (condition) => {
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