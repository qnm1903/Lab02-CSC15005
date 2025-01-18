import db from "../db/db.js";

const masterKey = Buffer.from(process.env.MASTER_KEY, 'hex');

export default class Note {
    constructor() {
        this.schema = process.env.POSTGRES_SCHEMA;
        this.tableName = 'note';
        this.db = db(this.schema);
    }

    createTable = async () => {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS ${this.tableName} (
                id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                content BYTEA NOT NULL,
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

    // Tạo ghi chú
    createNote = async (title, content) => {
        const query = `
            INSERT INTO ${this.tableName} (title, content)
            VALUES ($1, $2)
            RETURNING *;
        `;
        const values = [title, content];
    
        try {
            const { rows } = await this.db.query(query, values);
            return rows[0];
        } catch (err) {
            console.error('Error creating note:', err);
            throw err;
        }
    };
}