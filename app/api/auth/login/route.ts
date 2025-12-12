import { NextRequest, NextResponse } from 'next/server';
import { findOne } from '@/lib/database';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
    try {
        const { email, password, projectId } = await request.json();

        // Validate input
        if (!email || !password) {
            return NextResponse.json(
                { success: false, error: 'Email and password required' },
                { status: 400 }
            );
        }

        // Find user
        const userResult = findOne('app_users', { email, project_id: projectId || 'default' });

        if (!userResult.success || !userResult.data) {
            return NextResponse.json(
                { success: false, error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        const user = userResult.data as any;

        // Verify password
        const isValid = await bcrypt.compare(password, user.password_hash);

        if (!isValid) {
            return NextResponse.json(
                { success: false, error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Login success
        // In a real app, we would set a session cookie or JWT here.
        // For this local demo, we just return success.

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        });

    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
