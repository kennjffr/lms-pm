import { S3Client, PutObjectCommand, GetObjectCommand, CreateBucketCommand, HeadBucketCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const endpoint = `http://${process.env.MINIO_ENDPOINT || "localhost"}:${process.env.MINIO_PORT || "9000"}`;

export const s3Client = new S3Client({
  endpoint,
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY || "minioadmin",
    secretAccessKey: process.env.MINIO_SECRET_KEY || "minioadminpassword",
  },
  forcePathStyle: true, // Needed for MinIO
});

const BUCKET_NAME = "lms-files";

export async function ensureBucketExists() {
  try {
    await s3Client.send(new HeadBucketCommand({ Bucket: BUCKET_NAME }));
  } catch (error: any) {
    if (error.name === "NotFound" || error.$metadata?.httpStatusCode === 404) {
      try {
        await s3Client.send(new CreateBucketCommand({ Bucket: BUCKET_NAME }));
        console.log(`MinIO Bucket "${BUCKET_NAME}" created successfully.`);
      } catch (err) {
        console.error("Failed to create MinIO bucket:", err);
      }
    } else {
      console.error("Error checking MinIO bucket status:", error);
    }
  }
}

export async function uploadFile(key: string, body: Buffer | Uint8Array, contentType: string) {
  await ensureBucketExists();
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: body,
    ContentType: contentType,
  });
  await s3Client.send(command);
  return key;
}

export async function getDownloadUrl(key: string, originalName?: string): Promise<string> {
  await ensureBucketExists();
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ResponseContentDisposition: originalName ? `attachment; filename="${originalName}"` : undefined,
  });
  return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
}
