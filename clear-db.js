
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), '.ai-builder-data', 'database.sqlite');
const db = new Database(dbPath);

try {
    db.prepare('DELETE FROM app_form_submissions').run();
    console.log('Cleared table app_form_submissions');
} catch (e) {
    console.error(e.message);
}
