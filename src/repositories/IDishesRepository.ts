import { Dish, Ingredient } from "@prisma/client";

export interface INewDish {
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
  save(data: INewDish): Promise<IDishCreatedResponse>;
}

export default IDishesRepository;
