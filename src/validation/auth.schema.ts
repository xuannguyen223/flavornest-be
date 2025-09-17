import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must include at least one uppercase letter")
  .regex(/[a-z]/, "Password must include at least one lowercase letter")
  .regex(/[0-9]/, "Password must include at least one number")
  .regex(/[@$!%*?&]/, "Password must include at least one special character");

const login = z.object({
  body: z.object({
    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
  }),
});

const register = z.object({
  body: z.object({
    email: z.email("Invalid email format"),
    password: passwordSchema,
    fullname: z.string().optional(),
  }),
});

const authSchema = {
  login,
  register,
};

export default authSchema;
