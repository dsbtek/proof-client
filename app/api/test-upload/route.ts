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
        const barcode_string = requestHeaders.get("barcode");
        const internet_connection = requestHeaders.get("internet_connection");
        const app_version = requestHeaders.get("app_version");
        const os_version = requestHeaders.get("os_version");
        const phone_model = requestHeaders.get("phone_model");
        const device_name = requestHeaders.get("device_name");
        const device_storage = requestHeaders.get("device_storage");
        const look_away_time = requestHeaders.get("look_away_time");
        const hand_out_of_frame = requestHeaders.get("hand_out_of_frame");
        const drugkitname = requestHeaders.get("drugkitname");

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