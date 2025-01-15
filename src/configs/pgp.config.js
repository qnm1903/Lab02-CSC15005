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
    ssl: false,
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

db.connect()
    .then((obj) => {
        console.log('Database connection successful');
        obj.done();
    })
    .catch((error) => console.error('Database connection error:', error));

export { db, pgp };
export const {insert, update} = pgp.helpers;
