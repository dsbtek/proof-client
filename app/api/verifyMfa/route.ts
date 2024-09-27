import { NextResponse, type NextRequest } from "next/server";
import Twilio from "twilio";

import axios from "@/utils/axios";

// Get Tutorials Route: facilitates fetching tutorials
export async function POST(request: NextRequest) {
  const client = Twilio(
    process.env.NEXT_TWILIO_ACCOUNTSID as string,
    process.env.NEXT_TWILIO_AUTHTOKEN as string
  );

  const { phoneNumber, code } = await request.json();
  const VERIFY_SERVICE_SID = process.env.NEXT_VERIFY_SERVICE_SID;
  try {
    await client.verify.v2
      .services(VERIFY_SERVICE_SID as string)
      .verificationChecks.create({ to: phoneNumber, code })
      .then((res) => {
        return NextResponse.json({ data: res }, { status: 200 });
      })
      .catch((error) => {
        return NextResponse.error();
      });
  } catch (error: any) {
    console.error(error.response?.data?.msg);
    return NextResponse.error();
  }
}
