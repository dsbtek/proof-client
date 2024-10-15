import { NextResponse, type NextRequest } from "next/server";
import Twilio from "twilio";
import * as Sentry from "@sentry/nextjs";
import axios from "@/utils/axios";

// Get Tutorials Route: facilitates fetching tutorials
export async function POST(request: NextRequest) {
  const client = Twilio(
    process.env.NEXT_TWILIO_ACCOUNTSID as string,
    process.env.NEXT_TWILIO_AUTHTOKEN as string
  );

  const { phoneNumber } = await request.json();
  const VERIFY_SERVICE_SID = process.env.NEXT_VERIFY_SERVICE_SID;
  console.log(VERIFY_SERVICE_SID, "boooody");
  try {
    await client.verify.v2
      .services(VERIFY_SERVICE_SID as string)
      .verifications.create({
        to: phoneNumber,
        channel: "sms",
        locale: "en",
      })
      .then((res) => {
        console.log(res, "sssssssssssssmmmmmsssss");
        return NextResponse.json({ data: res }, { status: 200 });
      })
      .catch((error) => {
        console.log(error);
        return NextResponse.error();
      });
  } catch (error: any) {
    console.error(error.response?.data?.msg);
    Sentry.captureException(error.response?.data?.msg);
    return NextResponse.error();
  }
}
