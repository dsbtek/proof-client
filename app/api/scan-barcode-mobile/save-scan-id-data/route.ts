import redis from '@/utils/redis';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        // Parse the request body as JSON
        const { key, value } = await req.json();
        // Save data to Redis
        await redis.set(key, value);

        return NextResponse.json({ message: 'Data saved successfully!' });
    } catch (error) {
        console.error('Error saving data to Redis:', error);
        return NextResponse.json({ message: 'Error saving data' }, { status: 500 });
    }
}
