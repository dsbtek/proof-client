"use server";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import * as AWS from "aws-sdk";
import {
  RekognitionClient,
  DetectTextCommand,
} from "@aws-sdk/client-rekognition";
// import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
// import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { blobToBuffer, fileToBase64 } from "@/utils/utils";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";

const s3 = new AWS.S3();

//Creates an S3 client used to upload videos to the S3 bucket.
const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_S3_REGION,
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
  region: process.env.NEXT_PUBLIC_AWS_S3_REGION,
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

// // Generates a signed URL for the video file.
export const createPresignedUrl = async (key: string, contentType: string) => {
  // Your Cognito Identity Pool ID and region (adjust as needed)
  const identityPoolId = process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID; // Your Cognito Identity Pool ID
  const region = process.env.NEXT_PUBLIC_AWS_S3_REGION; // AWS region

  // Step 1: Initialize Cognito Identity client and use Identity Pool to get temporary credentials
  const credentials = fromCognitoIdentityPool({
    client: new CognitoIdentityClient({ region }),
    identityPoolId,
  });

  const s3Client = new S3Client({
    region,
    credentials,
  });

  try {
    let bucketName;

    // Decide which bucket to use based on content type (images or videos)
    if (contentType.startsWith("image/")) {
      bucketName = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME_IMAGES;

      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        ContentType: contentType,
      });

      // Generate the presigned URL (expires in 10 minutes)
      const signedUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 600,
      }); // expires in 600 seconds (10 minutes)
      return signedUrl;
    } else if (contentType.startsWith("video/")) {
      bucketName = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME_VIDEOS;
      // Prepare the command to generate a presigned URL
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        ContentType: "video/mp4",
      });
      // Generate the presigned URL (expires in 10 minutes)
      const signedUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 600,
      }); // expires in 600 seconds (10 minutes)
      return signedUrl;
    } else {
      throw new Error("Unsupported content type");
    }
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    throw error;
  }
};

export const uploadVideoToS3Bucket = async (
  base64string: string,
  key: string
) => {
  try {
    const base64Data = base64string.replace(/^data:video\/\w+;base64,/, ""); // Remove the data URL prefix
    const buffer = Buffer.from(base64Data, "base64");

    // Step 2: Initialize Cognito Identity client and use Identity Pool to get temporary credentials
    const identityPoolId = process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID;
    const region = process.env.NEXT_PUBLIC_AWS_S3_REGION;

    // Use Cognito Identity Pool to get temporary credentials
    const credentials = fromCognitoIdentityPool({
      client: new CognitoIdentityClient({ region }),
      identityPoolId,
    });

    // Step 3: Initialize the S3 client with temporary credentials
    const s3Client = new S3Client({
      region,
      credentials, // Temporary credentials from Cognito Identity Pool
    });

    // Step 4: Prepare the S3 upload parameters
    const params = {
      Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME_IMAGES, // Your S3 Bucket Name
      Key: key, // The key (path) for the file
      Body: buffer, // The file data (Blob converted to Buffer)
      ContentType: "video/mp4", // Assuming MP4 format, update if necessary (e.g., "video/webm")
    };

    // Step 5: Upload the file to S3
    const command = new PutObjectCommand(params);
    return await s3Client.send(command);

    // Step 6: Generate a URL (Assuming the bucket allows public access)
  } catch (error) {
    console.error("Error uploading video:", error);
    throw error;
  }
};

export const uploadVideoChunks = async (videoBlob: Blob, key: string) => {
  const chunkSize = 3 * 1024 * 1024; // 5MB
  const totalParts = Math.ceil(videoBlob.size / chunkSize);
  let uploadId: string | null = null;

  for (let partNumber = 1; partNumber <= totalParts; partNumber++) {
    const start = (partNumber - 1) * chunkSize;
    const end = Math.min(partNumber * chunkSize, videoBlob.size);
    const chunk = videoBlob.slice(start, end);

    const base64Chunk = await blobToBase64(chunk);

    if (!uploadId) {
      // Start the multipart upload
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoData: base64Chunk, key, partNumber }),
      });
      const data = await response.json();
      uploadId = data.uploadId;
    } else {
      // Upload the part
      await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoData: base64Chunk,
          key,
          uploadId,
          partNumber,
        }),
      });
    }
  }

  // Complete the upload
  return await fetch("/api/upload", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, uploadId }),
  });
};

// Helper to convert Blob to Base64 string
const blobToBase64 = async (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result!.toString().split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const uploadVideoWithFetchToS3 = async (
  url: string,
  buffer: Buffer,
  fileSize: number
) => {
  try {
    const response = await fetch(url, {
      method: "PUT",
      body: buffer, // Use the buffer as the file body
      headers: {
        "Content-Length": fileSize.toString(), // Convert size to string
        "Content-Type": "video/mp4", // Ensure the correct MIME type
      },
    });

    console.log("s3: ", response);
    if (response.ok && response.status === 200) {
      console.log("S3 Upload Success");
      return true; // Indicate that upload was successful
    } else {
      console.error(
        "Error uploading video:",
        response.status,
        response.statusText
      );
      return false;
    }
  } catch (error) {
    console.error("S3 Upload Error:", error);
    return false;
  }
};
