import { NextResponse } from 'next/server';
import { stations } from '@/lib/db';

export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const { id, updates } = body;

        if (!id || !updates) {
            return NextResponse.json({ success: false, error: 'Missing id or updates' }, { status: 400 });
        }

        const stationIndex = stations.findIndex(s => s.id === id);
        if (stationIndex === -1) {
            return NextResponse.json({ success: false, error: 'Station not found' }, { status: 404 });
        }

        // Apply updates
        stations[stationIndex] = {
            ...stations[stationIndex],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        return NextResponse.json({
            success: true,
            data: stations[stationIndex]
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 500 });
    }
}
