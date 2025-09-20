import s3 from "../config/awsS3.config";

class CDNService {
  private static BUCKET = process.env.AWS_S3_BUCKET;
  private static CDN_URL = process.env.AWS_CLOUDFRONT_URL;

  static getSignedUploadUrl = async (name: string, type: string) => {
    const fileNameWithTime = `${Date.now()}-${name}`;

    const params = {
      Bucket: this.BUCKET,
      Key: fileNameWithTime,
      Expires: 60,
      ContentType: type,
    };

    const uploadURL = await s3.getSignedUrlPromise("putObject", params);
    const fileURL = `https://${this.CDN_URL}/${fileNameWithTime}`;
    return { uploadURL, fileURL };
  };
}
export default CDNService;
