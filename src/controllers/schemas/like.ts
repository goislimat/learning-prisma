import { z } from "zod";

export const LikeSchema = z.object({
  params: z.object({
    dishId: z.coerce.number(),
  }),
  user: z.object({
    id: z.number(),
  }),
});
