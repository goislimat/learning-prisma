import { Dish, Ingredient } from "@prisma/client";

export interface ICreateDishParams {
  image: string;
  name: string;
  category: string;
  ingredients: string[];
  description: string;
  price: number;
}

export interface IDishCreatedResponse extends Dish {
  ingredients: Ingredient[];
}

interface IDishesRepository {
  save(data: ICreateDishParams): Promise<IDishCreatedResponse>;
}

export default IDishesRepository;
