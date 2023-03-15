import { Request, Response } from "express";

import DishesRepository from "../repositories/DishesRepository";
import DishesService from "../services/DishesService";
import DiskStorageService from "../services/DiskStorageService";
import zParse from "../utils/zParse";
import {
  DishCreateSchema,
  DishFetchAllSchema,
  DishFetchOneSchema,
  DishUpdateSchema,
} from "./schemas/dish";

class DishesController {
  async index(req: Request, res: Response) {
    const {
      user: { id: userId },
    } = await zParse(DishFetchAllSchema, req);

    const dishesRepository = new DishesRepository();
    const dishesService = new DishesService(dishesRepository);

    const dishes = await dishesService.getAllDishes(userId);

    return res.json(dishes);
  }

  async show(req: Request, res: Response) {
    const {
      params: { id },
      user: { id: userId },
    } = await zParse(DishFetchOneSchema, req);

    const dishesRepository = new DishesRepository();
    const dishesService = new DishesService(dishesRepository);

    const dish = await dishesService.getDishById(id, userId);

    return res.json(dish);
  }

  async create(req: Request, res: Response) {
    const {
      body: { name, category, description, ingredients, price },
      file: { filename },
    } = await zParse(DishCreateSchema, req);

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

  async update(req: Request, res: Response) {
    const {
      params: { id },
      body: { category, description, ingredients, name, price },
      file,
    } = await zParse(DishUpdateSchema, req);
    const filename = file?.filename;

    const diskStorageService = new DiskStorageService();
    const dishesRepository = new DishesRepository();
    const dishesService = new DishesService(
      dishesRepository,
      diskStorageService
    );
    const dish = await dishesService.updateDish(id, {
      name,
      category,
      ingredients,
      description,
      price,
      image: filename,
    });

    return res.json(dish);
  }
}

export default DishesController;
