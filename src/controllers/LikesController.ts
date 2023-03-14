import { Request, Response } from "express";
import { z } from "zod";

import DishesRepository from "../repositories/DishesRepository";
import DishLikesService from "../services/DishLikesService";
import zParse from "../utils/zParse";

const LikesSchema = z.object({
  params: z.object({
    dishId: z.coerce.number(),
  }),
  user: z.object({
    id: z.number(),
  }),
});

class LikesController {
  async create(req: Request, res: Response) {
    const {
      params: { dishId },
      user: { id: userId },
    } = await zParse(LikesSchema, req);

    const dishesRepository = new DishesRepository();
    const likesService = new DishLikesService(dishesRepository);
    await likesService.like({ userId, dishId });

    return res.status(201).json();
  }

  async delete(req: Request, res: Response) {
    const {
      params: { dishId },
      user: { id: userId },
    } = await zParse(LikesSchema, req);

    const dishesRepository = new DishesRepository();
    const likesService = new DishLikesService(dishesRepository);
    await likesService.dislike({ userId, dishId });

    return res.status(204).json();
  }
}

export default LikesController;
