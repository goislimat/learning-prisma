import { Prisma, PrismaClient } from "@prisma/client";
import HandledError from "../utils/HandledError";
import IDishesRepository, {
  addUserLikedDish,
  IAddLike,
  ICreateDishParams,
  IDishWithIngredients,
  IDishWithIngredientsAndUser,
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

  async findById(id: number): Promise<IDishWithIngredients> {
    try {
      const dish = await this.prisma.dish.findFirstOrThrow({
        where: {
          id,
        },
        include: {
          ingredients: true,
        },
      });

      return dish;
    } catch {
      throw new HandledError(
        `Could not find a dish record with id: ${id}`,
        404
      );
    }
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

  async saveLike({
    userId,
    dishId,
  }: IAddLike): Promise<IDishWithIngredientsAndUser> {
    try {
      const dish = await this.prisma.dish.update(
        addUserLikedDish(userId, dishId)
      );

      return dish;
    } catch {
      throw new HandledError(
        `Unable to favorite dish ${dishId} for user ${userId}`,
        422
      );
    }
  }
}

export default DishesRepository;
