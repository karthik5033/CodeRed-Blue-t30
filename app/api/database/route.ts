import { NextRequest, NextResponse } from 'next/server';
import * as db from '@/lib/database';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const table = searchParams.get('table');

    try {
        switch (action) {
            case 'tables':
                const tables = db.getTables();
                return NextResponse.json(tables);

            case 'schema':
                if (!table) {
                    return NextResponse.json({ success: false, error: 'Table name required' }, { status: 400 });
                }
                const schema = db.getTableSchema(table);
                return NextResponse.json(schema);

            case 'data':
                if (!table) {
                    return NextResponse.json({ success: false, error: 'Table name required' }, { status: 400 });
                }
                const limit = parseInt(searchParams.get('limit') || '100');
                const data = db.getAll(table, limit);
                return NextResponse.json(data);

            default:
                return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
        }
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, table, data, id } = body;

        switch (action) {
            case 'create_table':
                const { columns } = body;
                const result = db.createTable(table, columns);
                return NextResponse.json(result);

            case 'insert':
                const insertResult = db.insert(table, data);
                return NextResponse.json(insertResult);

            case 'update':
                const updateResult = db.update(table, id, data);
                return NextResponse.json(updateResult);

            case 'delete':
                const deleteResult = db.deleteRecord(table, id);
                return NextResponse.json(deleteResult);

            case 'clear':
                const clearResult = db.clearTable(table);
                return NextResponse.json(clearResult);

            case 'drop':
                const dropResult = db.dropTable(table);
                return NextResponse.json(dropResult);

            case 'delete_table':
                const deleteTableResult = db.deleteTable(table);
                return NextResponse.json(deleteTableResult);

            case 'execute':
                const { sql, params } = body;
                const execResult = db.executeSQL(sql, params || []);
                return NextResponse.json(execResult);

            default:
                return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
        }
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
