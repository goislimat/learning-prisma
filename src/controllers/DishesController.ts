import { Request, Response } from "express";
import { z } from "zod";

import DishesRepository from "../repositories/DishesRepository";
import DishesService from "../services/DishesService";
import DiskStorageService from "../services/DiskStorageService";
import zParse from "../utils/zParse";

const DishParamsSchema = z.object({
  params: z.object({
    id: z.coerce.number(),
  }),
});

const DishBodySchema = z.object({
  body: z.object({
    name: z.string().min(3).max(50),
    category: z.string().min(3).max(50),
    ingredients: z.string().min(3),
    description: z.string().min(3),
    price: z.coerce.number(),
  }),
});

const DishFileSchema = z.object({
  file: z.object({
    filename: z.string().optional(),
  }),
});

const DishCreateSchema = DishBodySchema.merge(DishFileSchema);

const DishUpdateSchema = DishParamsSchema.merge(DishBodySchema).merge(
  DishFileSchema.partial()
);

class DishesController {
  async index(req: Request, res: Response) {
    const dishesRepository = new DishesRepository();
    const dishesService = new DishesService(dishesRepository);

    const dishes = await dishesService.getAllDishes();

    return res.json(dishes);
  }

  async show(req: Request, res: Response) {
    const {
      params: { id },
    } = await zParse(DishParamsSchema, req);

    const dishesRepository = new DishesRepository();
    const dishesService = new DishesService(dishesRepository);

    const dish = await dishesService.getDishById(id);

    return res.json(dish);
  }

  async create(req: Request, res: Response) {
    console.log({
      body: req.body,
      file: req.file,
    });

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
