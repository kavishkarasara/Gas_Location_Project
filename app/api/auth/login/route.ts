import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json();

        // Find seller by username
        const { data: sellers, error: sellerError } = await supabase
            .from('sellers')
            .select('id, shop_name, password')
            .eq('username', username);

        if (sellerError) throw sellerError;

        if (!sellers || sellers.length === 0) {
            return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
        }

        const seller = sellers[0];

        // Basic plain-text password match (In a real app, use bcrypt.compare)
        if (seller.password !== password) {
            return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
        }

        // Fetch their associated station id to give to dashboard
        const { data: stations, error: stationError } = await supabase
            .from('gas_stations')
            .select('id')
            .eq('seller_id', seller.id);

        if (stationError) throw stationError;

        const stationId = stations && stations.length > 0 ? stations[0].id : null;

        if (!stationId) {
            return NextResponse.json({ success: false, error: 'Seller has no gas station assigned' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            user: {
                id: seller.id,
                name: seller.shop_name,
                role: 'SELLER',
                stationId: stationId
            }
        });

    } catch (error: any) {
        console.error("Login error:", error);
        return NextResponse.json({ success: false, error: 'Bad request' }, { status: 400 });
    }
}
