import { Dish, Ingredient, User } from "@prisma/client";

export interface ICreateDishParams {
  image: string;
  name: string;
  category: string;
  ingredients: string[];
  description: string;
  price: number;
}

export interface IDishWithIngredientsAndUser {
  id: Dish["id"];
  image: Dish["image"];
  name: Dish["name"];
  category: Dish["category"];
  description: Dish["description"];
  price: Dish["price"];
  ingredients: {
    name: Ingredient["name"];
  }[];
  favoritedBy: {
    id: User["id"];
  }[];
}

export interface ILikeUpdate {
  userId: number;
  dishId: number;
}

interface IDishesRepository {
  findAll(): Promise<IDishWithIngredientsAndUser[]>;
  findById(id: number): Promise<IDishWithIngredientsAndUser>;
  save(data: ICreateDishParams): Promise<IDishWithIngredientsAndUser>;
  saveLike(data: ILikeUpdate): Promise<IDishWithIngredientsAndUser>;
  removeLike(data: ILikeUpdate): Promise<IDishWithIngredientsAndUser>;
}

export default IDishesRepository;
