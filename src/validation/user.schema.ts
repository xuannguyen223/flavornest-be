import { z } from "zod";

const userIdSchema = z.string().trim().min(1, "User ID is required");

const getById = z.object({
  params: z.object({
    userId: userIdSchema,
  }),
});

const getProfileById = z.object({
  params: z.object({
    userId: userIdSchema,
  }),
});

const updateProfile = z.object({
  params: z.object({
    userId: userIdSchema,
  }),
});

const userSchema = {
  getById,
  getProfileById,
  updateProfile,
};

export default userSchema;
