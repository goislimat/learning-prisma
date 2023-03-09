import { Dish, Ingredient } from "@prisma/client";
import IDishesRepository from "../repositories/IDishesRepository";
import HandledError from "../utils/HandledError";
import DiskStorageService from "./DiskStorageService";

interface IDishFields {
  name: string;
  category: string;
  ingredients: string;
  description: string;
  price: string;
  image?: string;
}

interface IFormattedDish {
  name: string;
  category: string;
  ingredients: string[];
  description: string;
  price: number;
  image: string;
}

class DishesService {
  constructor(private dishesRepository: IDishesRepository) {}

  async createDish({
    name,
    category,
    ingredients,
    description,
    price,
    image,
  }: IDishFields): Promise<IFormattedDish> {
    if (!image) {
      throw new HandledError("The dish image is missing", 400);
    }

    const diskStorageService = new DiskStorageService();
    await diskStorageService.saveFile(image);

    const ingredientsArray = this.getIngredientsArray(ingredients);
    const priceNumber = this.getPriceAsNumber(price);

    const dish = await this.dishesRepository.save({
      name,
      category,
      ingredients: ingredientsArray,
      description,
      price: priceNumber,
      image,
    });

    return this.getFormattedDish(dish);
  }

  private getIngredientsArray(ingredients: string): string[] {
    return ingredients
      .split(",")
      .map((ingredient) => ingredient.trim().toLowerCase());
  }

  private getPriceAsNumber(price: string): number {
    return Number(price.replace(/\D/g, ""));
  }

  private getFormattedDish(
    dish: Dish & { ingredients: Ingredient[] }
  ): IFormattedDish {
    return {
      ...dish,
      ingredients: dish.ingredients.map((ingredient) => ingredient.name),
    };
  }
}

export default DishesService;
