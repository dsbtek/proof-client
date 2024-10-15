import { NextResponse, type NextRequest } from "next/server";
import * as Sentry from "@sentry/nextjs";
import axios from "@/utils/axios";

// Get Pre-Test Questionaire response Route: facilitates posting Questionaires responses
export async function POST(request: NextRequest) {
  try {
    const requestHeaders = new Headers(request.headers);
    const body = await request.json();

    const participant_id = requestHeaders.get("participant_id");
    const pin = requestHeaders.get("pin");
    const form_name = requestHeaders.get("form_name");
    const res = await axios.post("/SurveryResponse", body, {
      headers: { participant_id, pin, form_name },
    });
    if (res.status === 200) {
      return NextResponse.json({ data: res.data }, { status: 200 });
    } else {
      console.error(res.data.message);
    }
  } catch (error: any) {
    console.error(error.response?.data?.msg);
    Sentry.captureException(error.response?.data?.msg);
    return NextResponse.error();
  }
}
