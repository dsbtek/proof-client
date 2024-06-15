import { NextResponse, type NextRequest } from "next/server";

import axios from "@/utils/axios";

// Get Tutorials Route: facilitates fetching tutorials
export async function POST(request: NextRequest) {
  try {
    const requestHeaders = new Headers(request.headers);
    const participant_id = requestHeaders.get("participant_id");
    const pin = requestHeaders.get("pin");
    const res = await axios.post(
      "/history",
      {},
      { headers: { participant_id, pin } }
    );
    if (res.status === 200) {
      return NextResponse.json({ data: res.data }, { status: 200 });
    } else {
      console.error(res.data.message);
    }
  } catch (error: any) {
    console.error(error.response?.data?.msg);
    return NextResponse.error();
  }
}
