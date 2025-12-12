import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_DIR = path.join(process.cwd(), '.ai-builder-data');
const DB_FILE = path.join(DB_DIR, 'database.sqlite');

// Ensure database directory exists
if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
}

let dbInstance: Database.Database | null = null;

function getDb() {
    if (!dbInstance) {
        dbInstance = new Database(DB_FILE);
        // Enable WAL mode for better concurrency
        dbInstance.pragma('journal_mode = WAL');
    }
    return dbInstance;
}

// Convert generic types to SQLite types
function mapTypeToSqlite(type: string): string {
    const t = type.toUpperCase();
    if (t.includes('INT')) return 'INTEGER';
    if (t.includes('FLOAT') || t.includes('DOUBLE') || t.includes('REAL')) return 'REAL';
    if (t.includes('BOOL')) return 'INTEGER'; // SQLite uses 0/1 for booleans
    if (t.includes('BLOB')) return 'BLOB';
    return 'TEXT'; // Default to TEXT for string, json, etc.
}

export function createTable(tableName: string, columns: { name: string; type: string; constraints?: string }[]) {
    try {
        const db = getDb();
        const columnDefs = columns.map(col => {
            let def = `"${col.name}" ${mapTypeToSqlite(col.type)}`;
            if (col.constraints) def += ` ${col.constraints}`;
            return def;
        });

        // Always add generic ID if not specified (though usually handled by primary key in constraints)
        // For consistency with previous API, we'll assume 'id' integer primary key is good practice if not present
        // But the previous implementation hardcoded 'id' logic. Let's add an auto-increment ID.
        if (!columns.some(c => c.name === 'id')) {
            columnDefs.unshift('"id" INTEGER PRIMARY KEY AUTOINCREMENT');
        }

        // Add timestamps
        columnDefs.push('"created_at" TEXT DEFAULT CURRENT_TIMESTAMP');
        columnDefs.push('"updated_at" TEXT');

        const createSql = `CREATE TABLE IF NOT EXISTS "${tableName}" (${columnDefs.join(', ')});`;
        db.exec(createSql);

        return { success: true, message: `Table ${tableName} created` };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export function insert(tableName: string, data: Record<string, any>) {
    try {
        const db = getDb();

        // Check if table exists
        const tableCheck = db.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name=?`).get(tableName);
        if (!tableCheck) {
            return { success: false, error: 'Table does not exist' };
        }

        const keys = Object.keys(data);
        const placeholders = keys.map(() => '?').join(', ');
        const columnNames = keys.map(k => `"${k}"`).join(', ');

        // Add updated_at if it's not in data
        // created_at is handled by default value

        const stmt = db.prepare(`INSERT INTO "${tableName}" (${columnNames}) VALUES (${placeholders})`);
        const info = stmt.run(...Object.values(data));

        return { success: true, id: info.lastInsertRowid, changes: info.changes };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export function getAll(tableName: string, limit = 100) {
    try {
        const db = getDb();
        const stmt = db.prepare(`SELECT * FROM "${tableName}" LIMIT ?`);
        const rows = stmt.all(limit);
        return { success: true, data: rows };
    } catch (error: any) {
        // If table doesn't exist, return error matching previous API
        if (error.message.includes('no such table')) {
            return { success: false, error: 'Table does not exist' };
        }
        return { success: false, error: error.message };
    }
}

export function getById(tableName: string, id: number | string) {
    try {
        const db = getDb();
        const stmt = db.prepare(`SELECT * FROM "${tableName}" WHERE id = ?`);
        const row = stmt.get(id);
        return { success: true, data: row };
    } catch (error: any) {
        if (error.message.includes('no such table')) {
            return { success: false, error: 'Table does not exist' };
        }
        return { success: false, error: error.message };
    }
}

export function findOne(tableName: string, condition: Record<string, any>) {
    try {
        const db = getDb();
        const keys = Object.keys(condition);
        if (keys.length === 0) return { success: true, data: null };

        const whereClause = keys.map(k => `"${k}" = ?`).join(' AND ');
        const stmt = db.prepare(`SELECT * FROM "${tableName}" WHERE ${whereClause} LIMIT 1`);
        const row = stmt.get(...Object.values(condition));

        return { success: true, data: row };
    } catch (error: any) {
        if (error.message.includes('no such table')) {
            return { success: false, error: 'Table does not exist' };
        }
        return { success: false, error: error.message };
    }
}

export function update(tableName: string, id: number | string, data: Record<string, any>) {
    try {
        const db = getDb();
        const keys = Object.keys(data);
        if (keys.length === 0) return { success: true, changes: 0 };

        const setClause = keys.map(k => `"${k}" = ?`).join(', ') + ', updated_at = CURRENT_TIMESTAMP';
        const stmt = db.prepare(`UPDATE "${tableName}" SET ${setClause} WHERE id = ?`);
        const info = stmt.run(...Object.values(data), id);

        if (info.changes === 0) {
            // Check if row exists specifically? Or just return success: false?
            // Previous api said 'Row not found'
            return { success: false, error: 'Row not found or no changes made' };
        }

        return { success: true, changes: info.changes };
    } catch (error: any) {
        if (error.message.includes('no such table')) {
            return { success: false, error: 'Table does not exist' };
        }
        return { success: false, error: error.message };
    }
}

export function deleteRow(tableName: string, id: number | string) {
    try {
        const db = getDb();
        const stmt = db.prepare(`DELETE FROM "${tableName}" WHERE id = ?`);
        const info = stmt.run(id);
        return { success: true, changes: info.changes };
    } catch (error: any) {
        if (error.message.includes('no such table')) {
            return { success: false, error: 'Table does not exist' };
        }
        return { success: false, error: error.message };
    }
}

export function query(tableName: string, condition?: Record<string, any>) {
    try {
        const db = getDb();
        let sql = `SELECT * FROM "${tableName}"`;
        const params: any[] = [];

        if (condition && Object.keys(condition).length > 0) {
            const keys = Object.keys(condition);
            const whereClause = keys.map(k => `"${k}" = ?`).join(' AND ');
            sql += ` WHERE ${whereClause}`;
            params.push(...Object.values(condition));
        }

        const stmt = db.prepare(sql);
        const rows = stmt.all(...params);
        return { success: true, data: rows };
    } catch (error: any) {
        if (error.message.includes('no such table')) {
            return { success: false, error: 'Table does not exist' };
        }
        return { success: false, error: error.message };
    }
}

export function clearTable(tableName: string) {
    try {
        const db = getDb();
        db.prepare(`DELETE FROM "${tableName}"`).run();
        // Reset autoincrement?
        try {
            db.prepare(`DELETE FROM sqlite_sequence WHERE name=?`).run(tableName);
        } catch (e) { /* ignore */ }

        return { success: true, message: `Table ${tableName} cleared` };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export function dropTable(tableName: string) {
    try {
        const db = getDb();
        db.prepare(`DROP TABLE IF EXISTS "${tableName}"`).run();
        return { success: true, message: `Table ${tableName} dropped` };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export function getTables() {
    try {
        const db = getDb();
        const stmt = db.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'`);
        const rows = stmt.all();
        return { success: true, data: rows };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export function getTableSchema(tableName: string) {
    try {
        const db = getDb();
        const stmt = db.prepare(`PRAGMA table_info("${tableName}")`);
        const rows = stmt.all() as any[];

        // Map back to our format
        const schema = rows.map(col => ({
            name: col.name,
            type: col.type,
            // constraints? SQLite doesn't easily give orig constraints string back
        }));

        return { success: true, schema };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export function executeSQL(sql: string, params: any[] = []) {
    try {
        const db = getDb();
        // Determine if read or write
        const lowerSql = sql.trim().toLowerCase();
        if (lowerSql.startsWith('select') || lowerSql.startsWith('pragma')) {
            const stmt = db.prepare(sql);
            const data = stmt.all(...params);
            return { success: true, data };
        } else {
            const stmt = db.prepare(sql);
            const info = stmt.run(...params);
            return { success: true, changes: info.changes, lastInsertRowid: info.lastInsertRowid };
        }
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// Initialize system tables
createTable('visualProjects', [
    { name: 'name', type: 'TEXT' },
    { name: 'data', type: 'TEXT' }
]);

createTable('visualPages', [
    { name: 'project_id', type: 'TEXT' },
    { name: 'name', type: 'TEXT' },
    { name: 'elements', type: 'TEXT' }
]);

// Initialize app data tables for generated apps
createTable('app_users', [
    { name: 'project_id', type: 'TEXT' },
    { name: 'email', type: 'TEXT' },
    { name: 'password_hash', type: 'TEXT' },
    { name: 'name', type: 'TEXT' }
]);

createTable('app_form_submissions', [
    { name: 'project_id', type: 'TEXT' },
    { name: 'form_id', type: 'TEXT' },
    { name: 'data', type: 'TEXT' }
]);

