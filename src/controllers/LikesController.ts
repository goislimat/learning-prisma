import { Request, Response } from "express";

import DishesRepository from "../repositories/DishesRepository";
import DishLikesService from "../services/DishLikesService";
import zParse from "../utils/zParse";
import { LikeSchema } from "./schemas/like";

class LikesController {
  async create(req: Request, res: Response) {
    const {
      params: { dishId },
      user: { id: userId },
    } = await zParse(LikeSchema, req);

    const dishesRepository = new DishesRepository();
    const likesService = new DishLikesService(dishesRepository);
    await likesService.like({ userId, dishId });

    return res.status(201).json();
  }

  async delete(req: Request, res: Response) {
    const {
      params: { dishId },
      user: { id: userId },
    } = await zParse(LikeSchema, req);

    const dishesRepository = new DishesRepository();
    const likesService = new DishLikesService(dishesRepository);
    await likesService.dislike({ userId, dishId });

    return res.status(204).json();
  }
}

export default LikesController;
