import { z } from "zod";

export const CreateUserSchema = z.object({
  body: z.object({
    name: z.string().nonempty(),
    email: z.string().email(),
    password: z.string().min(6).max(50),
  }),
});
