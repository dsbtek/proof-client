"use server";

import { streamToBase64 } from "@/utils/utils";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: process.env.NEXT_AWS_S3_REGION,
    credentials: {
        accessKeyId: process.env.NEXT_AWS_S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.NEXT_AWS_S3_SECRET_ACCESS_KEY,
    },
});


export async function retrieveS3image(key: string) {
    const command = new GetObjectCommand({
        Bucket: process.env.NEXT_AWS_S3_BUCKET_NAME,
        Key: key,
    });

    try {
        const response = await s3Client.send(command);
        const str = await response.Body.transformToWebStream();
        const base64String = await streamToBase64(str);
        const contentType = response.ContentType || 'image/png';
        return `data:${contentType};base64,${base64String}`;
    } catch (err) {
        console.error(err);
    }
};