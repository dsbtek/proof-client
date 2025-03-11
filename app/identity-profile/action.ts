// "use server";

// import { streamToBase64 } from "@/utils/utils";
// import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

// const s3Client = new S3Client({
//   region: process.env.NEXT_AWS_S3_REGION,
//   credentials: {
//     accessKeyId: process.env.NEXT_AWS_S3_ACCESS_KEY_ID,
//     secretAccessKey: process.env.NEXT_AWS_S3_SECRET_ACCESS_KEY,
//   },
// });

// export async function retrieveS3image(key: string) {
//   const command = new GetObjectCommand({
//     // Bucket: process.env.NEXT_AWS_S3_BUCKET_NAME,
//     Bucket: process.env.NEXT_AWS_S3_BUCKET_NAME_IMAGES,
//     Key: key,
//   });

//   try {
//     const response = await s3Client.send(command);
//     const str = await response.Body.transformToWebStream();
//     const base64String = await streamToBase64(str);
//     const contentType = response.ContentType || "image/png";
//     return `data:${contentType};base64,${base64String}`;
//   } catch (err) {
//     console.error(err);
//   }
// }

// "use server";

// import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// // Initialize the S3 client (the IAM role will be used for authentication)
// const s3Client = new S3Client({
//   region: process.env.NEXT_AWS_S3_REGION,
//   credentials: {
//     // accessKeyId: process.env.NEXT_AWS_S3_ACCESS_KEY_ID,
//     // secretAccessKey: process.env.NEXT_AWS_S3_SECRET_ACCESS_KEY,
//     accessKeyId: null,
//     secretAccessKey: null,
//   },
// });

// export async function retrieveS3image(key: string) {
//   const command = new GetObjectCommand({
//     Bucket: process.env.NEXT_AWS_S3_BUCKET_NAME_IMAGES, // Your S3 bucket name
//     Key: key, // S3 object key (path)
//   });

//   try {
//     // Generate the pre-signed URL
//     const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // URL valid for 1 hour
//     console.log(url, "fetched url");
//     return url;
//   } catch (err) {
//     console.error("Error generating pre-signed URL:", err);
//     throw new Error("Error generating pre-signed URL");
//   }
// }

"use server";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { streamToBase64 } from "@/utils/utils";

// Function to retrieve an image from S3 using Cognito and temporary credentials
export async function retrieveS3image(key: string) {
  try {
    // Step 1: Initialize Cognito Identity client and use Identity Pool to get temporary credentials
    const identityPoolId = process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID; // Your Cognito Identity Pool ID
    const region = process.env.NEXT_PUBLIC_AWS_S3_REGION; // Your AWS region

    // Use Cognito Identity Pool to get temporary credentials
    const credentials = fromCognitoIdentityPool({
      client: new CognitoIdentityClient({ region }),
      identityPoolId, // Cognito Identity Pool ID
    });

    // Step 2: Initialize the S3 client with temporary credentials
    const s3Client = new S3Client({
      region,
      credentials, // Temporary credentials from Cognito Identity Pool
    });

    // Step 3: Prepare the S3 command to retrieve the file
    const command = new GetObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME_IMAGES,
      Key: key,
    });

    // Step 4: Fetch the image from S3
    const data = await s3Client.send(command);

    // Step 5: Convert the stream into a Base64 string (or you can directly send the stream if you prefer)
    const imageStream = data.Body;
    const base64String = await streamToBase64(imageStream);

    // Return the image as a Base64 string (or you could directly return the buffer/stream)
    return `data:${data.ContentType};base64,${base64String}`;
  } catch (error) {
    console.error("Error retrieving image from S3:", error);
    throw new Error("Failed to retrieve image from S3");
  }
}
