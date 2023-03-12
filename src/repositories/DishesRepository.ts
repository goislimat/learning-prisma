import { Prisma, PrismaClient } from "@prisma/client";
import HandledError from "../utils/HandledError";
import IDishesRepository, {
  ICreateDishParams,
  IDishWithIngredientsAndUser,
  ILikeUpdate,
  IUpdateDishParams,
} from "./IDishesRepository";
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

  async findAll(): Promise<IDishWithIngredientsAndUser[]> {
    const dishes = await this.prisma.dish.findMany({ select });

    return dishes;
  }

  async findById(id: number): Promise<IDishWithIngredientsAndUser> {
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
  }: ICreateDishParams): Promise<IDishWithIngredientsAndUser> {
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
  }: IUpdateDishParams): Promise<IDishWithIngredientsAndUser> {
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

  async saveLike({
    userId,
    dishId,
  }: ILikeUpdate): Promise<IDishWithIngredientsAndUser> {
    try {
      const dish = await this.prisma.dish.update(like(userId, dishId));

      return dish;
    } catch {
      throw new HandledError(
        `Unable to favorite dish ${dishId} for user ${userId}`,
        422
      );
    }
  }

  async removeLike({
    userId,
    dishId,
  }: ILikeUpdate): Promise<IDishWithIngredientsAndUser> {
    try {
      const dish = await this.prisma.dish.update(dislike(userId, dishId));

      return dish;
    } catch {
      throw new HandledError(
        `Unable to unfavorite dish ${dishId} for user ${userId}`,
        422
      );
    }
  }
}

export default DishesRepository;
