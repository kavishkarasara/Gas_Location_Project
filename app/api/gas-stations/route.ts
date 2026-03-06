import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('gas_stations')
            .select('*');

        if (error) throw error;

        // Transform slightly to match front-end expectations, mainly snake_case to camelCase
        const formattedData = data.map((station) => ({
            id: station.id,
            sellerId: station.seller_id,
            name: station.name,
            location: station.location,
            lat: station.lat,
            lng: station.lng,
            litro12_5kg: station.litro12_5kg,
            litro5kg: station.litro5kg,
            laugfs12_5kg: station.laugfs12_5kg,
            laugfs5kg: station.laugfs5kg,
            updatedAt: station.updated_at
        }));

        return NextResponse.json({
            success: true,
            data: formattedData
        });
    } catch (e: any) {
        return NextResponse.json(
            { success: false, error: e.message || 'Failed to fetch stations' },
            { status: 500 }
        );
    }
}
