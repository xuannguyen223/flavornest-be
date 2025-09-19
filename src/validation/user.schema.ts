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

const updateUserPreference = z.object({
  params: z.object({
    userId: userIdSchema,
  }),
  body: z.object({
    preferences: z.array(
      z.object({
        categoryId: z.string().min(1, "Invalid ID format"),
      })
    ),
  }),
});

const userSchema = {
  getById,
  getProfileById,
  updateProfile,
  updateUserPreference,
};

export default userSchema;
