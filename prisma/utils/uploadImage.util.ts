import axios from "axios";
import s3 from "../config/awsS3.config";
import type { MealDetailMockType } from "../types";

const getSignedUploadUrl = async (name: string, type: string) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: name,
    Expires: 60,
    ContentType: type,
  };

  const uploadURL = await s3.getSignedUrlPromise("putObject", params);
  const fileURL = `https://${process.env.AWS_CLOUDFRONT_URL}/${name}`;
  return { uploadURL, fileURL };
};

export const uploadImageRecipe = async (meal: MealDetailMockType) => {
  if (!meal || !meal.strMealThumb) {
    return "";
  }
  const response = await axios.get(meal.strMealThumb, {
    responseType: "arraybuffer",
  });
  const buffer = Buffer.from(response.data);
  const contentType = response.headers["content-type"] || "image/jpeg";
  const fileExt = meal.strMealThumb.split(".").pop() || "jpg";
  const fileName = `${Date.now()}-${meal.idMeal}.${fileExt}`;

  const { uploadURL, fileURL } = await getSignedUploadUrl(
    fileName,
    contentType
  );
  await axios.put(uploadURL, buffer, {
    headers: {
      "Content-Type": contentType,
    },
  });
  return `${process.env.AWS_CLOUDFRONT_URL}/${fileName}`;
};
