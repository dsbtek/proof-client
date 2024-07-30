import { detections } from './mailData';

export function emailTestResults(particpant_id = 8554443303, date = '02/07/2024', kit = 'PR Urine Kit', confirmation_no = '000111', detection = detections): string {
    let resultRows = '';
    let totalScore = '';
    let scoreRatio = '';
    let videoLink = '#';

    detection.map((data) => {
        if (data[0] === "score_ratios") {
            totalScore = `${(data[1].current! / data[1].total! * 100).toFixed(0)}%`;
            scoreRatio = `${data[1].current?.toFixed(2)}/${data[1].total}`;

        } else {
            resultRows += `<tr style="margin:0;padding:0;border:0;background-color:#f9f9f9;">
                                <td
                                    style="margin:0;border:0;padding:0;padding:18px 8px;font-size:12px;font-weight:400;line-height:20px;">
                                    ${data[0]}</td>
                                <td
                                    style="margin:0;border:0;padding:0;padding:18px 8px;font-size:12px;font-weight:400;line-height:20px;">
                                    ${data[1].note}</td>
                                <td
                                    style="margin:0;border:0;padding:0;padding:18px 8px;font-size:12px;font-weight:400;line-height:20px;">
                                    ${data[1].score?.toFixed(2)}</td>
                                <td
                                    style="margin:0;border:0;padding:0;padding:18px 8px;font-size:12px;font-weight:400;line-height:20px;">
                                    ${data[1].detection_hotspot_first}</td>
                                <td
                                    style="margin:0;border:0;padding:0;padding:18px 8px;font-size:12px;font-weight:400;line-height:20px;">
                                    ${data[1].detection_hotspot_last}</td>
                            </tr>`
        }
    });

    const template = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Proof Test Result Email Template</title>
    <style>
        #result-table>tbody>tr:hover {
            background-color: #f1f1f1
        }
    </style>
    <style type="text/css">
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap");
    </style>
</head>

<body style='margin:0;border:0;font-family:"Inter", sans-serif;background-color:#d8dada;'>
    <center class="wrapper"
        style="margin:0;padding:0;border:0;width:100%;table-layout:fixed;background-color:#F6F5F1;padding-bottom:60px;">
        <table class="main" width="100%"
            style="margin:0;padding:0;border:0;border-spacing:0;width:100%;max-width:600px;text-align:center;">
            <!-- LOGO -->
            <tr style="margin:0;padding:0;border:0;background-color: #ffffff;">
                <td style="margin:0;border:0;padding: 10px;"><img src="https://proofdata.s3.amazonaws.com/Logo.png"
                        alt="Proof Logo" width="68" style="margin:0;padding:0;border:0;max-width: 100%;"></td>
            </tr>
            <tr style="margin:0;padding:0;border:0;">
                <td style="margin:0;border:0;background-color: #0c1617; padding: 30px 20px;">
                    <table width="100%" style="margin:0;padding:0;border:0;border-spacing:0;">
                        <tr style="margin:0;padding:0;border:0;">
                            <td style="margin:0;border:0;padding:0;">
                                <h1
                                    style="margin:0;padding:0;border:0;font-weight: 600; font-size: 24px; line-height: 29px; color: #cdf5cb;">
                                    Test
                                    Report</h1>
                            </td>
                        </tr>
                        <tr style="margin:0;padding:0;border:0;">
                            <td style="margin:0;border:0;padding: 5px 0px;">
                                <p
                                    style="margin:0;padding:0;border:0;font-weight: 400; font-size: 14px; line-height: 16.94px; color: #eaeaea;">
                                    Confirmation No: ${confirmation_no}</p>
                            </td>
                        </tr>
                        <tr style="margin:0;padding:0;border:0;">
                            <td style="margin:0;border:0;padding: 5px 0px;">
                                <p
                                    style="margin:0;padding:0;border:0;font-weight: 400; font-size: 14px; line-height: 16.94px; color: #eaeaea;">
                                    Participant ID: ${particpant_id}</p>
                            </td>
                        </tr>
                        <tr style="margin:0;padding:0;border:0;">
                            <td style="margin:0;border:0;padding: 5px 0px;">
                                <p
                                    style="margin:0;padding:0;border:0;font-weight: 400; font-size: 14px; line-height: 16.94px; color: #eaeaea;">
                                    Kit: ${kit}</p>
                            </td>
                        </tr>
                        <tr style="margin:0;padding:0;border:0;">
                            <td style="margin:0;border:0;padding: 5px 0px;">
                                <p
                                    style="margin:0;padding:0;border:0;font-weight: 400; font-size: 14px; line-height: 16.94px; color: #eaeaea;">
                                    Date: ${date}</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr style="margin:0;padding:0;border:0;">
                <td style="margin:0;border:0;padding: 30px 20px;">
                    <table width="100%"
                        style="margin:0;border:0;border-spacing:0;background-color: #ffffff; box-shadow: 0 0 25px rgba(0, 0, 0, .15); border-radius: 16px; padding: 20px;">
                        <tr style="margin:0;padding:0;border:0;">
                            <td style="margin:0;border:0;padding:0;">
                                <h1
                                    style="margin:0;padding:0;border:0;font-weight: 700; font-size: 24px; line-height: 29.05px; color: #0c1617;">
                                    Total Score</h1>
                            </td>
                        </tr>
                        <tr style="margin:0;padding:0;border:0;">
                            <td style="margin:0;border:0;padding:0;">
                                <h1
                                    style="margin:0;padding:0;border:0;font-weight: 600; font-size: 40px; line-height: 48.41px; color: #009cf9;">
                                    ${totalScore}
                                </h1>
                            </td>
                        </tr>
                        <tr style="margin:0;padding:0;border:0;">
                            <td style="margin:0;border:0;padding: 20px 0;">
                                <p
                                    style="margin:0;border:0;display: inline-block; font-weight: 400; font-size: 14px; line-height: 16.94px; color: #2E3740; max-width: 247px; background-color: #E5F5FF; padding: 10px 20px; border-radius: 91px;">
                                    Score_ratio: ${scoreRatio}</p>
                            </td>
                        </tr>
                        <tr style="margin:0;padding:0;border:0;">
                            <td style="margin:0;border:0;padding:0;">
                                <a href=${videoLink}
                                    style="margin:0;border:0;display: inline-block; font-weight: 500; font-size: 18px; line-height: 12.78px; color: #ffffff; max-width: 205px; background-color: #009cf9; padding: 23px 32px; border-radius: 12px; text-decoration: none;">Download
                                    Video</a>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr style="margin:0;padding:0;border:0;">
                <td style="margin:0;border:0;padding:0;">
                    <table id="result-table"
                        style="margin:0;padding:0;border:0;border-spacing:0;width: 100%; border-collapse: collapse; font-size: 16px; text-align: center;">
                        <thead
                            style="margin:0;padding:0;border:0;background-color: #EDDAB2; color: #0C1617; font-weight: 500; font-size: 12px; line-height: 22px;">
                            <tr style="margin:0;padding:0;border:0;">
                                <th style="margin:0;padding:0;border:0;padding:12px 0;border:1px solid #ddd;">Action
                                </th>
                                <th style="margin:0;padding:0;border:0;padding:12px 0;border:1px solid #ddd;">Note</th>
                                <th style="margin:0;padding:0;border:0;padding:12px 0;border:1px solid #ddd;">Score</th>
                                <th style="margin:0;padding:0;border:0;padding:12px 0;border:1px solid #ddd;">First
                                    Detection</th>
                                <th style="margin:0;padding:0;border:0;padding:12px 0;border:1px solid #ddd;">Last
                                    Detection</th>
                            </tr>
                        </thead>
                        <tbody style="margin:0;padding:0;border:0;">
                            ${resultRows}
                        </tbody>
                    </table>
                </td>
            </tr>
        </table>
    </center>
</body>

</html>`;

    return template;
};