import { NextRequest, NextResponse } from "next/server";
import { emailTestResults } from '@/mail/email-templates';
import sendEmail from '@/mail/mailer';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const html = emailTestResults(body.participant_id, body.date, body.kit, body.confirmation_no, body.detections);

        // const res = await sendEmail('osheviremajoroh@punch.agency', 'Test Results', html)
        // const mail1 = await sendEmail('osheviremajoroh@gmail.com', 'Test Results', html);
        // const mail2 = await sendEmail('osheviremajoroh@yahoo.com', 'Test Results', html);
        const mail1 = await sendEmail('mahnoorkamran@punch.cool', 'Test Results', html);
        const res = await sendEmail('joshuaeseigbe@punch.agency', 'Test Results', html);
        const mail2 = await sendEmail('developer@punch.cool', 'Test Results', html);

        console.log(res)

        return NextResponse.json({ data: [res, mail1, mail2,] }, { status: 200 });
        // if (res.status === 200) {
        //     return NextResponse.json({ data: res.data }, { status: 200 });
        // } else {
        //     console.error(res.data.message);
        // }
    } catch (error: any) {
        console.error(error.response?.data?.msg);
        return NextResponse.error();
    }
}
