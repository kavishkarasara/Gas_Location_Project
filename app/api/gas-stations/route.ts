import { NextResponse } from 'next/server';
import { stations } from '@/lib/db';

export async function GET() {
    return NextResponse.json({
        success: true,
        data: stations
    });
}
