import { NextRequest, NextResponse } from 'next/server';
import * as db from '@/lib/database';

/**
 * Test endpoint to verify database is working
 * Access: http://localhost:4000/api/test-database
 */
export async function GET(request: NextRequest) {
    try {
        // Create a test table
        const createResult = db.createTable('test_todos', [
            { name: 'id', type: 'INTEGER', constraints: 'PRIMARY KEY' },
            { name: 'data', type: 'TEXT' },
            { name: 'created_at', type: 'TEXT' }
        ]);

        // Insert test data
        const insertResult = db.insert('test_todos', {
            data: JSON.stringify({ text: 'Test todo item', completed: false })
        });

        // Get all data
        const getData = db.getAll('test_todos');

        // Get all tables
        const tables = db.getTables();

        return NextResponse.json({
            success: true,
            message: 'Database is working!',
            results: {
                createTable: createResult,
                insert: insertResult,
                getData: getData,
                allTables: tables
            }
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
