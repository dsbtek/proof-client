import { NextRequest, NextResponse } from "next/server";
import axios from "@/utils/axios";
import * as Sentry from "@sentry/nextjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const alcoOraltoxImg = body.alcoOraltoxImg;
    const res = await axios.post(
      "https://proof-api-7de87a4faca9.herokuapp.com/read-oraltox-device",
      {base64_image:alcoOraltoxImg!.replace(/^data:image\/\w+;base64,/, "")},
      { headers: { "Content-Type": "application/json",} }
    );
    console.log(res)
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
