import { Prisma } from "@prisma/client";

export const select = Prisma.validator<Prisma.DishSelect>()({
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

export function findById(id: number) {
  return Prisma.validator<Prisma.DishFindFirstOrThrowArgs>()({
    where: {
      id,
    },
    select,
  });
}

export function createDishWithIngredients(
  image: string,
  name: string,
  category: string,
  price: number,
  description: string,
  ingredients: string[]
) {
  return Prisma.validator<Prisma.DishCreateArgs>()({
    data: {
      image,
      name,
      category,
      price,
      description,
      ingredients: {
        connectOrCreate: ingredients.map((ingredient) => ({
          create: {
            name: ingredient,
          },
          where: {
            name: ingredient,
          },
        })),
      },
    },
    select,
  });
}

export function updateDishWithIngredients(
  id: number,
  image: string,
  name: string,
  category: string,
  price: number,
  description: string,
  ingredientsToAdd: string[],
  ingredientsToRemove: string[]
) {
  return Prisma.validator<Prisma.DishUpdateArgs>()({
    where: {
      id,
    },
    data: {
      image,
      name,
      category,
      price,
      description,
      ingredients: {
        connectOrCreate: ingredientsToAdd.map((ingredient) => ({
          create: {
            name: ingredient,
          },
          where: {
            name: ingredient,
          },
        })),
        disconnect: ingredientsToRemove.map((ingredient) => ({
          name: ingredient,
        })),
      },
    },
    select,
  });
}

export function like(userId: number, dishId: number) {
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
    select,
  });
}

export function dislike(userId: number, dishId: number) {
  return Prisma.validator<Prisma.DishUpdateArgs>()({
    where: {
      id: dishId,
    },
    data: {
      favoritedBy: {
        disconnect: {
          id: userId,
        },
      },
    },
    select,
  });
}
