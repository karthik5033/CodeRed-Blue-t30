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
                return cors(NextResponse.json(tables));

            case 'schema':
                if (!table) {
                    return cors(NextResponse.json({ success: false, error: 'Table name required' }, { status: 400 }));
                }
                const schema = db.getTableSchema(table);
                return cors(NextResponse.json(schema));

            case 'data':
                if (!table) {
                    return cors(NextResponse.json({ success: false, error: 'Table name required' }, { status: 400 }));
                }
                const limit = parseInt(searchParams.get('limit') || '100');
                const data = db.getAll(table, limit);
                return cors(NextResponse.json(data));

            case 'count':
                if (!table) {
                    return cors(NextResponse.json({ success: false, error: 'Table name required' }, { status: 400 }));
                }
                const countData = db.getAll(table);
                if (countData.success) {
                    return cors(NextResponse.json({ success: true, count: countData.data?.length || 0 }));
                }
                return cors(NextResponse.json(countData));

            default:
                return cors(NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 }));
        }
    } catch (error: any) {
        return cors(NextResponse.json({ success: false, error: error.message }, { status: 500 }));
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
                return cors(NextResponse.json(result));

            case 'insert':
                console.log('[API] Inserting into', table, data); // DEBUG
                const insertResult = db.insert(table, data);
                console.log('[API] Insert result:', insertResult); // DEBUG
                return cors(NextResponse.json(insertResult));

            case 'update':
                const updateResult = db.update(table, id, data);
                return cors(NextResponse.json(updateResult));

            case 'delete':
                const deleteResult = db.deleteRow(table, id);
                return cors(NextResponse.json(deleteResult));

            case 'clear':
                const clearResult = db.clearTable(table);
                return cors(NextResponse.json(clearResult));

            case 'drop':
                const dropResult = db.dropTable(table);
                return cors(NextResponse.json(dropResult));

            case 'delete_table':
                const deleteTableResult = db.dropTable(table);
                return cors(NextResponse.json(deleteTableResult));

            case 'execute':
                const { sql, params } = body;
                const execResult = db.executeSQL(sql, params || []);
                return cors(NextResponse.json(execResult));

            default:
                return cors(NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 }));
        }
    } catch (error: any) {
        return cors(NextResponse.json({ success: false, error: error.message }, { status: 500 }));
    }
}

export async function OPTIONS(request: NextRequest) {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}

function cors(response: NextResponse) {
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return response;
}
