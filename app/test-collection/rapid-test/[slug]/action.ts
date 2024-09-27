"use server";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import {
  RekognitionClient,
  DetectTextCommand,
} from "@aws-sdk/client-rekognition";
// import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
// import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { fileToBase64 } from "@/utils/utils";

//Creates an S3 client used to upload videos to the S3 bucket.
const s3Client = new S3Client({
  region: process.env.NEXT_AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_AWS_S3_SECRET_ACCESS_KEY,
  },
});

//Uploads video to S3 bucket.
export async function uploadVideoToS3(formData: FormData, key: string) {
  try {
    //Returns the video file.
    const videoData = formData.get("video") as File;

    // Converts video file to an array buffer.
    const buffer = await videoData.arrayBuffer();

    const params = {
      Bucket: process.env.NEXT_AWS_S3_BUCKET_NAME,
      Key: key,
      Body: Buffer.from(buffer),
      ContentType: "video/mp4",
    };

    const command = new PutObjectCommand(params);
    const response = await s3Client.send(command);
    console.log(response);
    console.log(key);
    return response;
  } catch (error) {
    console.error("Server Action Error:", error);
  }
}

// Create an Amazon Transcribe service client object.
const rekognitionClient = new RekognitionClient({
  region: process.env.NEXT_AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_AWS_S3_SECRET_ACCESS_KEY,
  },
  // credentials: fromCognitoIdentityPool({
  //     client: new CognitoIdentityClient({ region: process.env.NEXT_AWS_S3_REGION }),
  //     identityPoolId: "IDENTITY_POOL_ID",
  // }),
});

//Detects barcode in screen captures.
export async function detectBarcodes(base64String: string) {
  try {
    // Remove the data URL prefix (if present)
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");

    // Convert the Base64 string to a buffer
    const buffer = Buffer.from(base64Data, "base64");

    const params = {
      Image: {
        Bytes: buffer,
      },
    };

    const response = await rekognitionClient.send(
      new DetectTextCommand(params)
    );
    console.log(response);
    return response;
  } catch (error) {
    console.error("Server Action Error:", error);
  }
}

// Generates a signed URL for the video file.
export const createPresignedUrl = (key: string) => {
  const client = s3Client;
  const command = new PutObjectCommand({
    Bucket: process.env.NEXT_AWS_S3_BUCKET_NAME,
    Key: key,
  });
  return getSignedUrl(client, command, { expiresIn: 600000 });
};
