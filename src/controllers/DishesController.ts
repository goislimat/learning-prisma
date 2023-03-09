import { Request, Response } from "express";
import DishesRepository from "../repositories/DishesRepository";
import DishesService from "../services/DishesService";

class DishesController {
  async create(req: Request, res: Response) {
    const { name, category, ingredients, description, price } = req.body;
    const filename = req.file?.filename;

    const dishesRepository = new DishesRepository();
    const dishesService = new DishesService(dishesRepository);
    const dish = await dishesService.createDish({
      name,
      category,
      ingredients,
      description,
      price,
      image: filename,
    });

    return res.status(201).json(dish);
  }
}

export default DishesController;
