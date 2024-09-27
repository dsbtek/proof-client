import { NextResponse, type NextRequest } from "next/server";

import axios from "@/utils/axios";

// Login Route: facilitates login
export async function POST(request: NextRequest) {
  try {
    const requestHeaders = new Headers(request.headers);
    const participant_id = requestHeaders.get("participant_id");
    const pin = requestHeaders.get("pin");
    const res = await axios.post(
      "/ProofLoginv3",
      {},
      { headers: { participant_id, pin, submitted: 1706033912 } }
    );
    if (res.status === 200) {
      return NextResponse.json({ data: res.data }, { status: 200 });
    } else {
      console.error(res.data);
      return NextResponse.json({ data: res.data }, { status: res.status });
    }
  } catch (error: any) {
    console.error("Login Server Error:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
