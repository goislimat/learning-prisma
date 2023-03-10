import { Prisma, PrismaClient } from "@prisma/client";
import HandledError from "../utils/HandledError";
import IDishesRepository, {
  ICreateDishParams,
  IDishWithIngredients,
} from "./IDishesRepository";

class DishesRepository implements IDishesRepository {
  private prisma = new PrismaClient();

  async findAll(): Promise<IDishWithIngredients[]> {
    const dishes = await this.prisma.dish.findMany({
      include: {
        ingredients: true,
      },
    });

    return dishes;
  }

  async save({
    image,
    name,
    category,
    ingredients,
    price,
    description,
  }: ICreateDishParams): Promise<IDishWithIngredients> {
    try {
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
    } catch (err) {
      if (err instanceof Prisma.PrismaClientValidationError) {
        throw new HandledError(
          "A new record could not be created with the provided data",
          400
        );
      }

      throw err;
    }
  }
}

export default DishesRepository;
