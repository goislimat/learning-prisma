import { Prisma, PrismaClient } from "@prisma/client";
import {
  DishCreateInput,
  DishTransactionResponse,
  DishUpdateInput,
} from "../types/dish";
import { LikeParams } from "../types/like";
import HandledError from "../utils/HandledError";
import IDishesRepository from "./IDishesRepository";
import {
  createDishWithIngredients,
  dislike,
  findById,
  like,
  select,
  updateDishWithIngredients,
} from "./validators/dish";

class DishesRepository implements IDishesRepository {
  private prisma = new PrismaClient();

  async findAll(q?: string): Promise<DishTransactionResponse[]> {
    let dishes;

    if (q) {
      dishes = await this.prisma.dish.findMany({
        where: {
          OR: [
            {
              name: {
                contains: q,
              },
            },
            {
              ingredients: {
                some: {
                  name: {
                    contains: q,
                  },
                },
              },
            },
          ],
        },
        select,
      });
    } else {
      dishes = await this.prisma.dish.findMany({ select });
    }

    return dishes;
  }

  async findById(id: number): Promise<DishTransactionResponse> {
    try {
      const dish = await this.prisma.dish.findFirstOrThrow(findById(id));

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
  }: DishCreateInput): Promise<DishTransactionResponse> {
    try {
      const createdDish = await this.prisma.dish.create(
        createDishWithIngredients(
          image,
          name,
          category,
          price,
          description,
          ingredients
        )
      );

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

  async update({
    id,
    image,
    name,
    category,
    ingredientsToAdd,
    ingredientsToRemove,
    price,
    description,
  }: DishUpdateInput): Promise<DishTransactionResponse> {
    try {
      const updatedDish = await this.prisma.dish.update(
        updateDishWithIngredients(
          id,
          image,
          name,
          category,
          price,
          description,
          ingredientsToAdd,
          ingredientsToRemove
        )
      );

      return updatedDish;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientValidationError) {
        throw new HandledError(
          "The record could not be updated with the provided data",
          400
        );
      }

      throw err;
    }
  }

  async saveLike({ userId, dishId }: LikeParams): Promise<boolean> {
    try {
      await this.prisma.dish.update(like(userId, dishId));

      return true;
    } catch {
      throw new HandledError(
        `Unable to favorite dish ${dishId} for user ${userId}`,
        422
      );
    }
  }

  async removeLike({ userId, dishId }: LikeParams): Promise<boolean> {
    try {
      await this.prisma.dish.update(dislike(userId, dishId));

      return true;
    } catch {
      throw new HandledError(
        `Unable to unfavorite dish ${dishId} for user ${userId}`,
        422
      );
    }
  }
}

export default DishesRepository;
