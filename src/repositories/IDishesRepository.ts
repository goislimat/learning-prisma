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

export interface IAddLike {
  userId: number;
  dishId: number;
}

interface IDishesRepository {
  findAll(): Promise<IDishWithIngredients[]>;
  findById(id: number): Promise<IDishWithIngredients>;
  save(data: ICreateDishParams): Promise<IDishWithIngredients>;
  saveLike(data: IAddLike): Promise<void>;
}

export default IDishesRepository;
