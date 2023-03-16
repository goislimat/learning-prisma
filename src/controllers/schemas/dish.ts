import { z } from "zod";

const DishParamsSchema = z.object({
  params: z.object({
    id: z.coerce.number(),
  }),
});

const UserRequestSchema = z.object({
  user: z.object({
    id: z.coerce.number(),
  }),
});

const DishQuerySchema = z.object({
  query: z.object({
    q: z.string().optional(),
  }),
});

const DishBodySchema = z.object({
  body: z.object({
    name: z.string(),
    category: z.string(),
    ingredients: z.string(),
    description: z.string(),
    price: z.coerce.number(),
  }),
});

const DishFileSchema = z.object({
  file: z.object({
    filename: z.string(),
  }),
});

export const DishFetchAllSchema = UserRequestSchema.merge(DishQuerySchema);

export const DishFetchOneSchema = DishParamsSchema.merge(UserRequestSchema);

export const DishCreateSchema = DishBodySchema.merge(DishFileSchema);

export const DishUpdateSchema = DishParamsSchema.merge(
  DishBodySchema.deepPartial().required()
).merge(DishFileSchema.partial());
