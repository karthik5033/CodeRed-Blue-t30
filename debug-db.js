
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), '.ai-builder-data', 'database.sqlite');
const db = new Database(dbPath);

try {
    const rows = db.prepare('SELECT * FROM app_form_submissions').all();
    console.log('Row count:', rows.length);
    console.log('Rows:', JSON.stringify(rows, null, 2));
} catch (e) {
    console.error(e.message);
}
