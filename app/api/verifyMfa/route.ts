import { NextResponse, type NextRequest } from "next/server";
import Twilio from "twilio";

export async function POST(request: NextRequest) {
  const client = Twilio(
    process.env.NEXT_TWILIO_ACCOUNTSID as string,
    process.env.NEXT_TWILIO_AUTHTOKEN as string
  );

  const VERIFY_SERVICE_SID = process.env.NEXT_VERIFY_SERVICE_SID;

  try {
    const { phoneNumber, code } = await request.json();

    if (!phoneNumber || !code) {
      return NextResponse.json(
        { error: "Phone number and code are required" },
        { status: 400 }
      );
    }

    const response = await client.verify.v2
      .services(VERIFY_SERVICE_SID as string)
      .verificationChecks.create({
        to: phoneNumber,
        code,
      });

    return NextResponse.json({ data: response }, { status: 200 });
  } catch (error: any) {
    console.error("Verification failed:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
