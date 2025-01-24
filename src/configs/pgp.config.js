import pgPromise from 'pg-promise';
import dotenv from 'dotenv';

dotenv.config();

const connection = {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DATABASE,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    ssl: { rejectUnauthorized: false }
};

const options = {
    capSQL: true,
    query: (e) => {
        console.log('Query:', e.query);
    },
    error: (error, e) => {
        console.error('Error:', error.message || error);
        if (e.query) {
            console.error('Failed Query:', e.query);
        }
    }
};

const pgp = pgPromise(options);
const db = pgp(connection);

// Function to enable the uuid-ossp extension
const enableUUIDExtension = async () => {
    const enableExtensionQuery = `
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    `;

    try {
        await db.query(enableExtensionQuery);
        console.log('UUID-OSSP extension enabled or already exists.');
    } catch (err) {
        console.error('Error enabling UUID-OSSP extension:', err);
    }
};

const createNoteTable =
    `
        CREATE TABLE IF NOT EXISTS note (
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            user_id SERIAL NOT NULL,
            title VARCHAR(255) NOT NULL,
            content BYTEA NOT NULL,
            salt TEXT NOT NULL,
            iv TEXT NOT NULL,
            authtag TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

// Table creation function
const createTable = async (Query) => {
    const createTableQuery = Query;

    try {
        await db.query(createTableQuery);
        console.log(`Table is created or already exists.`);
    } catch (err) {
        console.error(`Error creating table :`, err);
    }
};

db.connect()
    .then(async (obj) => {
        console.log('Database connection successful');
        obj.done();
        // Khởi tạo extension UUID-OSSP
        await enableUUIDExtension();

        await createTable(createNoteTable);
    })
    .catch((error) => console.error('Database connection error:', error));

export { db, pgp };
export const {insert, update} = pgp.helpers;
