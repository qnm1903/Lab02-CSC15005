import {db, pgp} from '../configs/pgp.config.js';

async function deleteExpiredSharedNotes() {
    try {
        const result = await db.query(`
            DELETE FROM "public"."shared_note"
            WHERE "expiry_date" <= NOW()
            returning id
        `);

        if (result.length > 0) {
            console.log(`Deleted ${result.length} expired shared notes:`);
            result.forEach(row => console.log(`- ID: ${row.id}`));
        } else {
            console.log('No expired shared notes found.');
        }
    } catch (error) {
        console.error('Error deleting expired shared notes:', error);
    }
}

// Xóa shared note hết hạn mỗi phút
setInterval(deleteExpiredSharedNotes, 60 * 1000);

console.log('Background worker started. Checking for expired shared notes every minute...');