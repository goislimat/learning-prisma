import { Request, Response } from "express";
import DishesRepository from "../repositories/DishesRepository";
import DishLikesService from "../services/DishLikesService";

class LikesController {
  async create(req: Request, res: Response) {
    const { dishId } = req.params;
    const { id: userId } = req.user;

    const dishesRepository = new DishesRepository();
    const likesService = new DishLikesService(dishesRepository);
    await likesService.like({ userId, dishId });

    return res.status(201).json();
  }
}

export default LikesController;
