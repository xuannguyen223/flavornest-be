import { z } from "zod";

const getUploadUrl = z.object({
  query: z.object({
    name: z.string().trim().min(1, "File name is required"),
    type: z.string().trim().min(1, "File type (mime) is required"),
  }),
});

const cdnSchema = {
  getUploadUrl,
};

export default cdnSchema;
