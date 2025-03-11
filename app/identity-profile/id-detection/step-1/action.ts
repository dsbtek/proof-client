"use server";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_S3_REGION,
  credentials: {
    accessKeyId: null,
    secretAccessKey: null,
  },
});

// export async function uploadFileToS3(base64String: string, key: string) {
//   try {
//     // Remove the data URL prefix (if present)
//     const matches = base64String.match(/^data:(image\/\w+);base64,/);

//     if (!matches || !matches[1]) {
//       throw new Error("Invalid base64 string format");
//     }

//     // Extract the Content-Type from the base64 string
//     const contentType = matches[1];

//     // Remove the data URL prefix (if present) to get the pure base64 data
//     const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");

//     // Convert the Base64 string to a buffer
//     const buffer = Buffer.from(base64Data, "base64");

//     // Prepare the S3 upload parameters
//     const params = {
//       Bucket: process.env.NEXT_AWS_S3_BUCKET_NAME,
//       Key: key,
//       Body: buffer,
//       ContentType: contentType, // Set the Content-Type here
//     };

//     // Create the command to upload the file to S3
//     const command = new PutObjectCommand(params);

//     // Send the request to S3
//     const response = await s3Client.send(command);
//     console.log("File uploaded successfully:", response);
//   } catch (error) {
//     console.error("Error uploading file:", error);
//   }
// }

export async function uploadImagesToS3(base64String: string, key: string) {
  try {
    // Step 1: Remove the data URL prefix (if present) and decode the Base64 string
    const matches = base64String.match(/^data:(image\/\w+);base64,/);

    if (!matches || !matches[1]) {
      throw new Error("Invalid base64 string format");
    }

    // Extract the Content-Type from the base64 string (e.g., image/jpeg)
    const contentType = matches[1];

    // Clean the base64 string to get the raw data
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");

    // Convert the Base64 string to a binary buffer
    const buffer = Buffer.from(base64Data, "base64");

    // Step 2: Initialize Cognito Identity client and use Identity Pool to get temporary credentials
    const identityPoolId = process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID; //process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID; // Your Cognito Identity Pool ID
    const region = "us-east-1"; //process.env.NEXT_PUBLIC_AWS_REGION; // Your AWS region

    // Use Cognito Identity Pool to get temporary credentials
    const credentials = fromCognitoIdentityPool({
      client: new CognitoIdentityClient({ region }),
      identityPoolId, // Cognito Identity Pool ID
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
      Body: buffer, // The file data (Base64 decoded into a Buffer)
      ContentType: contentType, // Content Type for the file
    };

    // Step 5: Upload the file to S3
    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    console.log("File uploaded successfully");
  } catch (error) {
    console.error("Error uploading file:", error);
  }
}
