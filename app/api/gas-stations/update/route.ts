import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const { id, updates } = body;

        if (!id || !updates) {
            return NextResponse.json({ success: false, error: 'Missing id or updates' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('gas_stations')
            .update({
                ...updates,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select();

        if (error) throw error;

        if (!data || data.length === 0) {
            return NextResponse.json({ success: false, error: 'Station not found or update failed' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: data[0]
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message || 'Invalid request' }, { status: 500 });
    }
}
