import { Dish as PrismaDish, Ingredient } from "@prisma/client";
import { User } from "./user";

export type Dish = Omit<PrismaDish, "createdAt" | "updatedAt">;

export type DishCreateParams = Omit<Dish, "id"> & {
  ingredients: string;
};
export type DishUpdateParams = Partial<DishCreateParams>;

export type DishResponse = Dish & {
  ingredients: string[];
  isFavorited: boolean;
};

export type DishCreateInput = Omit<Dish, "id"> & {
  ingredients: string[];
};
export type DishUpdateInput = Dish & {
  ingredientsToAdd: string[];
  ingredientsToRemove: string[];
};
export type DishTransactionResponse = Dish & {
  ingredients: Pick<Ingredient, "name">[];
  favoritedBy: Pick<User, "id">[];
};
