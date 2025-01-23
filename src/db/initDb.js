import Note from '../models/note.model.js';

async function initializeDatabase() {
    try {
        const noteModel = new Note();
        await noteModel.createTable();
        console.log('Database initialization complete.');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}

initializeDatabase();