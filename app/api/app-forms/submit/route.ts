import { NextRequest, NextResponse } from 'next/server';
import { insert } from '@/lib/database';

export async function POST(request: NextRequest) {
    try {
        const { formId, data, projectId } = await request.json();

        const result = await insert('app_form_submissions', {
            project_id: projectId || 'default',
            form_id: formId || 'contact',
            data: JSON.stringify(data),
        });

        if (result.success) {
            return NextResponse.json({
                success: true,
                id: result.id,
            });
        } else {
            return NextResponse.json(
                { success: false, error: result.error },
                { status: 500 }
            );
        }
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId') || 'default';

    try {
        const { query } = await import('@/lib/database');
        const result = await query('app_form_submissions', { project_id: projectId });

        if (result.success) {
            return NextResponse.json({
                success: true,
                submissions: result.data,
            });
        } else {
            return NextResponse.json(
                { success: false, error: result.error },
                { status: 500 }
            );
        }
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
