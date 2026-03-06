import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { username, password, shopName, location, lat, lng } = body;

        if (!username || !password || !shopName || !lat || !lng) {
            return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 400 });
        }

        // 1. Create Seller in `sellers` table
        const { data: sellerData, error: sellerError } = await supabase
            .from('sellers')
            .insert([{
                username,
                password, // In a real app, hash this!
                shop_name: shopName,
                location,
                lat: parseFloat(lat),
                lng: parseFloat(lng)
            }])
            .select()
            .single();

        if (sellerError) {
            // Handle duplicate username (unique constraint violation)
            if (sellerError.code === '23505') {
                return NextResponse.json({ success: false, error: 'Username already exists' }, { status: 409 });
            }
            throw sellerError;
        }

        // 2. Create Gas Station for this seller in `gas_stations` table
        const { data: stationData, error: stationError } = await supabase
            .from('gas_stations')
            .insert([{
                seller_id: sellerData.id,
                name: shopName,
                location: location || "Custom Location",
                lat: parseFloat(lat),
                lng: parseFloat(lng)
            }])
            .select()
            .single();

        if (stationError) {
            throw stationError;
        }

        return NextResponse.json({
            success: true,
            user: {
                id: sellerData.id,
                name: shopName,
                role: 'SELLER',
                stationId: stationData.id // Tie frontend station id logic exactly to this generated UUID
            }
        });

    } catch (error: any) {
        console.error("Signup error:", error);
        return NextResponse.json({ success: false, error: error.message || 'Failed to create account' }, { status: 500 });
    }
}
