import { NextResponse, type NextRequest } from 'next/server';
import * as Sentry from "@sentry/nextjs";
import axios from "@/utils/axios";

// Get Drug Kit Details: facilitates testing.
export async function POST(request: NextRequest) {
    try {
        const requestHeaders = new Headers(request.headers)
        const participant_id = requestHeaders.get("participant_id");
        const pin = requestHeaders.get("pin");
        const kit_id = requestHeaders.get("kit_id");
        const res = await axios.post("/DrugKitDetails", {}, { headers: { participant_id, pin, kit_id }, });
        if (res.status === 200) {
            console.log(res.data);
            return NextResponse.json({ data: res.data }, { status: 200 });
        } else {
            console.error(res.data.message);
            return NextResponse.json({ data: res.data }, { status: res.status });
        }
    } catch (error: any) {
        console.error(error.message);
        Sentry.captureException(error);
        return NextResponse.json({ error: error }, { status: 500 });
    }
}