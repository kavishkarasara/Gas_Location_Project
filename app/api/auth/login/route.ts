import { NextResponse } from 'next/server';
import { stations } from '@/lib/db';

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json();

        // Mock authentication: any username/password combination where username matches a station ID is allowed
        // Or we just hardcode one for simplicity
        if (username === 'admin' && password === '1234') {
            return NextResponse.json({
                success: true,
                user: {
                    id: 'seller_1',
                    name: 'Admin Seller',
                    role: 'SELLER',
                    stationId: stations[0].id // Assuming this seller manages the first station
                }
            });
        }

        return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Bad request' }, { status: 400 });
    }
}
