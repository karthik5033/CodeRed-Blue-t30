import { NextRequest, NextResponse } from 'next/server';
import { insert, findOne } from '@/lib/database';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
    try {
        const { email, password, name, projectId } = await request.json();

        // Validate input
        if (!email || !password) {
            return NextResponse.json(
                { success: false, error: 'Email and password required' },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = findOne('app_users', { email, project_id: projectId || 'default' });
        if (existingUser.data) {
            return NextResponse.json(
                { success: false, error: 'User already exists' },
                { status: 400 }
            );
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create user
        const result = insert('app_users', {
            project_id: projectId || 'default',
            email,
            password_hash: passwordHash,
            name: name || '',
        });

        if (result.success) {
            // Get the ID properly
            const userId = result.id;

            return NextResponse.json({
                success: true,
                user: {
                    id: userId,
                    email,
                    name: name || '',
                },
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
