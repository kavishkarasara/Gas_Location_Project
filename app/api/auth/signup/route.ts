import { NextResponse } from 'next/server';
import { stations, type GasStation } from '@/lib/db';
import crypto from 'crypto';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { username, password, shopName, location, lat, lng } = body;

        // Very basic validation
        if (!username || !password || !shopName || !lat || !lng) {
            return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 400 });
        }

        // Generate unique ID
        const stationId = 'station_' + crypto.randomUUID().split('-')[0];

        // Create new station with default empty tanks
        const newStation: GasStation = {
            id: stationId,
            name: shopName,
            location: location || "Custom Location",
            lat: parseFloat(lat),
            lng: parseFloat(lng),
            litro12_5kg: false,
            litro5kg: false,
            laugfs12_5kg: false,
            laugfs5kg: false,
            updatedAt: new Date().toISOString()
        };

        stations.push(newStation);

        // Auto-login after signup
        return NextResponse.json({
            success: true,
            user: {
                id: 'seller_' + crypto.randomUUID().split('-')[0],
                name: shopName,
                role: 'SELLER',
                stationId: stationId
            }
        });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to create account' }, { status: 500 });
    }
}
