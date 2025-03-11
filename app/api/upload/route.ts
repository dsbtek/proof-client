import { NextRequest, NextResponse } from "next/server";
import {
  S3Client,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  ListPartsCommand,
} from "@aws-sdk/client-s3";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_S3_REGION,
  credentials: fromCognitoIdentityPool({
    client: new CognitoIdentityClient({
      region: process.env.NEXT_PUBLIC_AWS_S3_REGION,
    }),
    identityPoolId: process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID,
  }),
});

const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB (can adjust depending on your needs)

// Helper function to convert Blob to Buffer
const blobToBuffer = async (blob: Blob): Promise<Buffer> => {
  const arrayBuffer = await blob.arrayBuffer();
  return Buffer.from(arrayBuffer);
};

// export async function POST(req: NextRequest) {
//   try {
//     const { base64string, key } = await req.json(); // Get base64string and key from request body

//     const base64Data = base64string.replace(/^data:video\/\w+;base64,/, ""); // Remove the data URL prefix
//     const buffer = Buffer.from(base64Data, "base64");

//     // Step 2: Initialize Cognito Identity client and use Identity Pool to get temporary credentials
//     const identityPoolId = process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID;
//     const region = process.env.NEXT_PUBLIC_AWS_S3_REGION;

//     // Use Cognito Identity Pool to get temporary credentials
//     const credentials = fromCognitoIdentityPool({
//       client: new CognitoIdentityClient({ region }),
//       identityPoolId,
//     });

//     // Step 3: Initialize the S3 client with temporary credentials
//     const s3Client = new S3Client({
//       region,
//       credentials, // Temporary credentials from Cognito Identity Pool
//     });

//     // Step 4: Prepare the S3 upload parameters
//     const params = {
//       Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME_VIDEOS, // Your S3 Bucket Name
//       Key: key, // The key (path) for the file
//       Body: buffer, // The file data (Blob converted to Buffer)
//       ContentType: "video/mp4", // Assuming MP4 format, update if necessary (e.g., "video/webm")
//     };

//     // Step 5: Upload the file to S3
//     const command = new PutObjectCommand(params);
//     await s3Client.send(command);

//     // Return success response
//     return NextResponse.json({ message: "Video uploaded successfully!" });
//   } catch (error) {
//     console.error("Error uploading video:", error);
//     return NextResponse.json(
//       { error: "Error uploading video" },
//       { status: 500 }
//     );
//   }
// }

// The main POST handler for uploading video
export async function POST(req: NextRequest) {
  const { videoData, key, uploadId, partNumber } = await req.json();

  try {
    // Step 1: Start the Multipart Upload (only first time)
    if (!uploadId) {
      const params = {
        Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME_VIDEOS!,
        Key: key,
      };
      const command = new CreateMultipartUploadCommand(params);
      const { UploadId } = await s3Client.send(command);
      return NextResponse.json({ uploadId: UploadId });
    }

    // Step 2: Upload the parts
    const partBuffer = Buffer.from(videoData, "base64"); // Convert Base64 string to Buffer

    const uploadPartParams = {
      Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME_VIDEOS!,
      Key: key,
      PartNumber: partNumber, // Part number for this chunk
      UploadId: uploadId, // Upload ID from multipart upload
      Body: partBuffer, // The file part data
    };

    const uploadPartCommand = new UploadPartCommand(uploadPartParams);
    const { ETag } = await s3Client.send(uploadPartCommand);

    return NextResponse.json({ partNumber, ETag });
  } catch (error) {
    console.error("Error during multipart upload:", error);
    return NextResponse.json(
      { error: "Error uploading video part" },
      { status: 500 }
    );
  }
}

// // Handler for completing the upload
export async function PUT(req: NextRequest) {
  const { key, uploadId } = await req.json();

  try {
    const listPartsParams = {
      Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME_VIDEOS!,
      Key: key,
      UploadId: uploadId,
    };

    const listPartsCommand = new ListPartsCommand(listPartsParams);
    const { Parts } = await s3Client.send(listPartsCommand);

    const completeParams = {
      Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME_VIDEOS!,
      Key: key,
      UploadId: uploadId,
      MultipartUpload: {
        Parts: Parts!.map((part: any) => ({
          ETag: part.ETag,
          PartNumber: part.PartNumber,
        })),
      },
    };

    const completeCommand = new CompleteMultipartUploadCommand(completeParams);
    await s3Client.send(completeCommand);

    return NextResponse.json({ message: "Upload complete" });
  } catch (error) {
    console.error("Error completing multipart upload:", error);
    return NextResponse.json(
      { error: "Error completing multipart upload" },
      { status: 500 }
    );
  }
}
