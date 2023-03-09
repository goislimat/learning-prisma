import { Dish, Ingredient } from "@prisma/client";

export interface INewDish {
  image: string;
  name: string;
  category: string;
  ingredients: string[];
  description: string;
  price: number;
}

interface IDishesRepository {
  save(data: INewDish): Promise<Dish & { ingredients: Ingredient[] }>;
}

export default IDishesRepository;
