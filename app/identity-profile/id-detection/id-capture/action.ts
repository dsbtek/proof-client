"use server";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_AWS_S3_SECRET_ACCESS_KEY,
  },
});

// export async function uploadFileToS3(base64String: string, key: string) {
//     try {

//         // Remove the data URL prefix (if present)
//         const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');

//         // Convert the Base64 string to a buffer
//         const buffer = Buffer.from(base64Data, 'base64');

//         const params = {
//             Bucket: process.env.NEXT_AWS_S3_BUCKET_NAME,
//             Key: key,
//             Body: buffer
//         };

//         const command = new PutObjectCommand(params);
//         const response = await s3Client.send(command);
//         console.log(response);
//     } catch (error) {
//         console.error(error);
//     }
// }
export async function uploadFileToS3(base64String: string, key: string) {
  try {
    // Remove the data URL prefix (if present)
    const matches = base64String.match(/^data:(image\/\w+);base64,/);

    if (!matches || !matches[1]) {
      throw new Error("Invalid base64 string format");
    }

    // Extract the Content-Type from the base64 string
    const contentType = matches[1];

    // Remove the data URL prefix (if present) to get the pure base64 data
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");

    // Convert the Base64 string to a buffer
    const buffer = Buffer.from(base64Data, "base64");

    // Prepare the S3 upload parameters
    const params = {
      Bucket: process.env.NEXT_AWS_S3_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType, // Set the Content-Type here
    };

    // Create the command to upload the file to S3
    const command = new PutObjectCommand(params);

    // Send the request to S3
    const response = await s3Client.send(command);
    console.log("File uploaded successfully:", response);
  } catch (error) {
    console.error("Error uploading file:", error);
  }
}
