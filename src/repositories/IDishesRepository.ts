import { Dish, Ingredient } from "@prisma/client";

export interface ICreateDishParams {
  image: string;
  name: string;
  category: string;
  ingredients: string[];
  description: string;
  price: number;
}

export interface IDishWithIngredients extends Dish {
  ingredients: Ingredient[];
}

interface IDishesRepository {
  findAll(): Promise<IDishWithIngredients[]>;
  findById(id: number): Promise<IDishWithIngredients>;
  save(data: ICreateDishParams): Promise<IDishWithIngredients>;
}

export default IDishesRepository;
