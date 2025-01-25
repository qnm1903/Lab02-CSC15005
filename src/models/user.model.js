import db from "../db/db.js";

export default class User {
    constructor() {
        this.schema = process.env.POSTGRES_SCHEMA;
        this.tableName = 'users';
        this.db = db(this.schema);
    }

    async one(id) {
        try {
            return await this.db.one(this.tableName, "id", id);
        } catch (error) {
            return {success: false, message: error.message};
        }
    }

    async oneByUserName(username) {
        try {
            return await this.db.one(this.tableName, "username", username);
        } catch (error) {
            return {success: false, message: error.message};
        }
    }

    async oneByEmail(email) {
        try {
            return await this.db.one(this.tableName, "email", email);
        } catch (error) {
            return {success: false, message: error.message};
        }
    }

    async add(user) {
        try {
            const res = await this.db.add(this.tableName, null, user);
            if (!res.success) {
                return { success: false, message: "Failed to add" };
            }
            return { success: true, message: "Added succesfully" };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }

    async deleteUserbyUsername(condition) {
        try {
            const result = await this.db.delete(this.tableName, condition);
        } catch (error) {
            console.error("Error delete games:", error);
            throw error;
        }
    }
}