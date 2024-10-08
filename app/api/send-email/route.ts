import { NextRequest, NextResponse } from "next/server";
import { emailTestResults } from "@/mail/email-templates";
import sendEmail from "@/mail/mailer";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
      console.log(body, "from body");
      const html = emailTestResults(
          body.participant_id,
          body.date,
          body.kit,
          body.confirmation_no,
          body.videoLink,
          body.face_scan_score,
          body.detections,
          body.config
      );

      // const res = await sendEmail('osheviremajoroh@punch.agency', 'Test Results', html)
      // const mail1 = await sendEmail('osheviremajoroh@gmail.com', 'Test Results', html);
      // const mail2 = await sendEmail('osheviremajoroh@yahoo.com', 'Test Results', html);
      // const mail3 = await sendEmail('joshuaeseigbe@punch.agency', 'Test Results', html);
      const res = await sendEmail(
          "joshuaeseigbe@punch.agency",
          "Test Results",
          html
      );
      const mail1 = await sendEmail(
          "mahnoorkamran@punch.cool",
          "Test Results",
          html
      );
      // const mail2 = await sendEmail('developer@punch.cool', 'Test Results', html);
      // const mail3 = await sendEmail('kirk@recoverytrek.com', 'Test Results', html);

      console.log(res);

      return NextResponse.json({ data: [res, mail1] }, { status: 200 });
      // return NextResponse.json({ data: [res, mail1, mail2, mail3] }, { status: 200 });
  } catch (error: any) {
      console.error("Send Mail Error:", error);
      return NextResponse.error();
  }
}