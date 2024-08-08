import { NextResponse, type NextRequest } from 'next/server';

import axios from "@/utils/axios";

// Uploads a Self drug Test.
export async function POST(request: NextRequest) {
    try {
        const requestHeaders = new Headers(request.headers)
        const participant_id = requestHeaders.get("participant_id");
        const url = requestHeaders.get("url");
        const photo_url = requestHeaders.get("photo_url");
        const start_time = requestHeaders.get("start_time");
        const end_time = requestHeaders.get("end_time");
        const submitted = requestHeaders.get("submitted");

        const res = await axios.post("/selfdrugtest", {}, { headers: { participant_id, url, photo_url, start_time, end_time, submitted, }, });

        if (res.status === 200) {
            console.log(res.data);
            return NextResponse.json({ data: res.data }, { status: 200 });
        } else {
            console.error(res.data.message);
            return NextResponse.json({ data: res.data }, { status: res.status });
        }
    } catch (error: any) {
        console.error('Test Upload Error:', error.response?.data?.msg);
        return NextResponse.error();
    }
}