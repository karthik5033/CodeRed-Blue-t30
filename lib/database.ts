import fs from 'fs';
import path from 'path';

const DB_DIR = path.join(process.cwd(), '.ai-builder-data');
const DB_FILE = path.join(DB_DIR, 'database.json');

// Ensure database directory exists
if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
}

// Initialize database file
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ tables: {} }, null, 2));
}

interface Database {
    tables: {
        [tableName: string]: {
            columns: { name: string; type: string; constraints?: string }[];
            rows: any[];
        };
    };
}

function readDB(): Database {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
}

function writeDB(db: Database) {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

export function createTable(tableName: string, columns: { name: string; type: string; constraints?: string }[]) {
    try {
        const db = readDB();
        if (!db.tables[tableName]) {
            db.tables[tableName] = { columns, rows: [] };
            writeDB(db);
        }
        return { success: true, message: `Table ${tableName} created` };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export function insert(tableName: string, data: Record<string, any>) {
    try {
        const db = readDB();
        if (!db.tables[tableName]) {
            return { success: false, error: 'Table does not exist' };
        }

        const id = db.tables[tableName].rows.length + 1;
        const row = { id, ...data, created_at: new Date().toISOString() };
        db.tables[tableName].rows.push(row);
        writeDB(db);

        return { success: true, id, changes: 1 };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export function getAll(tableName: string, limit = 100) {
    try {
        const db = readDB();
        if (!db.tables[tableName]) {
            return { success: false, error: 'Table does not exist' };
        }

        const rows = db.tables[tableName].rows.slice(0, limit);
        return { success: true, data: rows };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export function getById(tableName: string, id: number | string) {
    try {
        const db = readDB();
        if (!db.tables[tableName]) {
            return { success: false, error: 'Table does not exist' };
        }

        const row = db.tables[tableName].rows.find(r => r.id == id);
        return { success: true, data: row };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export function update(tableName: string, id: number | string, data: Record<string, any>) {
    try {
        const db = readDB();
        if (!db.tables[tableName]) {
            return { success: false, error: 'Table does not exist' };
        }

        const index = db.tables[tableName].rows.findIndex(r => r.id == id);
        if (index === -1) {
            return { success: false, error: 'Record not found' };
        }

        db.tables[tableName].rows[index] = { ...db.tables[tableName].rows[index], ...data };
        writeDB(db);

        return { success: true, changes: 1 };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export function deleteRecord(tableName: string, id: number | string) {
    try {
        const db = readDB();
        if (!db.tables[tableName]) {
            return { success: false, error: 'Table does not exist' };
        }

        const initialLength = db.tables[tableName].rows.length;
        db.tables[tableName].rows = db.tables[tableName].rows.filter(r => r.id != id);
        const changes = initialLength - db.tables[tableName].rows.length;
        writeDB(db);

        return { success: true, changes };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export function getTables() {
    try {
        const db = readDB();
        const tables = Object.keys(db.tables).map(name => ({ name }));
        return { success: true, data: tables };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export function deleteTable(tableName: string) {
    try {
        const db = readDB();
        if (db.tables[tableName]) {
            delete db.tables[tableName];
            writeDB(db);
            return { success: true, message: `Table ${tableName} deleted` };
        }
        return { success: false, error: 'Table not found' };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export function getTableSchema(tableName: string) {
    try {
        const db = readDB();
        if (!db.tables[tableName]) {
            return { success: false, error: 'Table does not exist' };
        }

        return { success: true, data: db.tables[tableName].columns };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export function clearTable(tableName: string) {
    try {
        const db = readDB();
        if (!db.tables[tableName]) {
            return { success: false, error: 'Table does not exist' };
        }

        db.tables[tableName].rows = [];
        writeDB(db);

        return { success: true, message: `Table ${tableName} cleared` };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export function dropTable(tableName: string) {
    try {
        const db = readDB();
        delete db.tables[tableName];
        writeDB(db);

        return { success: true, message: `Table ${tableName} dropped` };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export function executeSQL(sql: string, params: any[] = []) {
    return { success: false, error: 'Raw SQL not supported in JSON database' };
}
