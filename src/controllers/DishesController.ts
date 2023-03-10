import { Request, Response } from "express";

import DishesRepository from "../repositories/DishesRepository";
import DishesService from "../services/DishesService";
import DiskStorageService from "../services/DiskStorageService";

class DishesController {
  async index(req: Request, res: Response) {
    const dishesRepository = new DishesRepository();
    const dishesService = new DishesService(dishesRepository);

    const dishes = await dishesService.getAllDishes();

    return res.json(dishes);
  }

  async create(req: Request, res: Response) {
    const { name, category, ingredients, description, price } = req.body;
    const filename = req.file?.filename;

    const diskStorageService = new DiskStorageService();
    const dishesRepository = new DishesRepository();
    const dishesService = new DishesService(
      dishesRepository,
      diskStorageService
    );
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
