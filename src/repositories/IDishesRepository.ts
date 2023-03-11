import { Dish, Ingredient, Prisma, User } from "@prisma/client";

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
export interface IDishWithIngredients extends Dish {
  ingredients: Ingredient[];
}

export interface IAddLike {
  userId: number;
  dishId: number;
}

const dishSelect = Prisma.validator<Prisma.DishSelect>()({
  id: true,
  image: true,
  name: true,
  category: true,
  price: true,
  description: true,
  ingredients: {
    select: {
      name: true,
    },
  },
  favoritedBy: {
    select: {
      id: true,
    },
  },
});

export const addUserLikedDish = (userId: number, dishId: number) => {
  return Prisma.validator<Prisma.DishUpdateArgs>()({
    where: {
      id: dishId,
    },
    data: {
      favoritedBy: {
        connect: {
          id: userId,
        },
      },
    },
    select: dishSelect,
  });
};

interface IDishesRepository {
  findAll(): Promise<IDishWithIngredients[]>;
  findById(id: number): Promise<IDishWithIngredients>;
  save(data: ICreateDishParams): Promise<IDishWithIngredients>;
  saveLike(data: IAddLike): Promise<IDishWithIngredientsAndUser>;
}

export default IDishesRepository;
