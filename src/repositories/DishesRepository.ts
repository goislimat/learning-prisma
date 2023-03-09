import { Dish, Ingredient, PrismaClient } from "@prisma/client";
import IDishesRepository, { INewDish } from "./IDishesRepository";

class DishesRepository implements IDishesRepository {
  private prisma = new PrismaClient();

  async save({
    image,
    name,
    category,
    ingredients,
    price,
    description,
  }: INewDish): Promise<Dish & { ingredients: Ingredient[] }> {
    const createdDish = await this.prisma.dish.create({
      data: {
        image,
        name,
        category,
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
        price,
        description,
      },
      include: {
        ingredients: true,
      },
    });

    return createdDish;
  }
}

export default DishesRepository;
