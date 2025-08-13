import { S3Client } from "@aws-sdk/client-s3";
import { SESClient } from "@aws-sdk/client-ses";
import { CloudFrontClient } from "@aws-sdk/client-cloudfront";

// AWS Configuration
const awsConfig = {
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
};

// S3 Client for file uploads
const s3 = new S3Client({
  ...awsConfig,
  params: {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
  },
});

// SES Client for sending emails
const ses = new SESClient(awsConfig);

// CloudFront for CDN (optional)
const cloudfront = new CloudFrontClient(awsConfig);

export default {
  s3,
  ses,
  cloudfront,
};
