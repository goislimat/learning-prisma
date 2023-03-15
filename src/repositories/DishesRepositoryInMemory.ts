import { z } from "zod";
import { LikeParams } from "./../types/like";

import {
  DishCreateInput,
  DishTransactionResponse,
  DishUpdateInput,
} from "../types/dish";
import HandledError from "../utils/HandledError";
import IDishesRepository from "./IDishesRepository";

class DishesRepositoryInMemory implements IDishesRepository {
  public dishes: DishTransactionResponse[] = [
    {
      id: 1,
      image: "1678369738935-756807316-carbonara.webp",
      name: "Spaghetti alla Carbonara",
      category: "meal",
      price: 1999,
      description:
        "Spaghetti made on bacon fat with spices and decorated with bacon cubes and grated cheese",
      ingredients: [
        {
          name: "pasta",
        },
        {
          name: "cheese",
        },
        {
          name: "bacon",
        },
      ],
      favoritedBy: [
        {
          id: 1,
        },
      ],
    },
  ];

  async findAll(): Promise<DishTransactionResponse[]> {
    const allDishes: Promise<DishTransactionResponse[]> = new Promise(
      (resolve) => {
        resolve(this.dishes);
      }
    );

    return allDishes;
  }

  async findById(id: number): Promise<DishTransactionResponse> {
    const dish: Promise<DishTransactionResponse> = new Promise(
      (resolve, reject) => {
        const fetchedDish = this.dishes.find((d) => d.id === id);

        if (fetchedDish) {
          resolve(fetchedDish);
        }

        reject(
          new HandledError(`Could not find a dish record with id: ${id}`, 404)
        );
      }
    );

    return dish;
  }

  async save(dish: DishCreateInput): Promise<DishTransactionResponse> {
    const dishWithIngredients: Promise<DishTransactionResponse> = new Promise(
      (resolve, reject) => {
        const createdDish = {
          ...dish,
          id: Math.floor(Math.random() * 100) + 1,
          ingredients: dish.ingredients.map((ingredient) => ({
            name: ingredient,
          })),
          favoritedBy: [],
        };

        this.dishes.push(createdDish);

        resolve(createdDish);
      }
    );

    return dishWithIngredients;
  }

  async update(data: DishUpdateInput): Promise<DishTransactionResponse> {
    const dish: Promise<DishTransactionResponse> = new Promise(
      (resolve, reject) => {
        const dish = this.dishes.find((d) => d.id === data.id);

        if (dish) {
          const ingredients = [
            ...dish.ingredients,
            ...data.ingredientsToAdd.map((ingredient) => ({
              name: ingredient,
            })),
          ].filter(
            (ingredient) => !data.ingredientsToRemove.includes(ingredient.name)
          );

          const updatedDish = {
            ...dish,
            image: data.image || dish.image,
            name: data.name,
            description: data.description,
            price: data.price,
            category: data.category,
            ingredients,
          };

          const DishSchema = z.object({
            id: z.number(),
            image: z.string().nonempty(),
            name: z.string().nonempty(),
            category: z.string().nonempty(),
            price: z.number(),
            description: z.string().nonempty(),
            ingredients: z.array(z.object({ name: z.string() })).nonempty(),
            favoritedBy: z.array(z.object({ id: z.number() })),
          });

          try {
            DishSchema.parse(updatedDish);
          } catch {
            reject(
              new HandledError(
                "The record could not be updated with the provided data",
                400
              )
            );
          }

          resolve(updatedDish);
        }

        reject(new HandledError("Dish not found", 404));
      }
    );

    return dish;
  }

  async saveLike({ userId, dishId }: LikeParams): Promise<boolean> {
    const dish: Promise<boolean> = new Promise((resolve, reject) => {
      const dish = this.dishes.find((d) => d.id === dishId);

      if (dish) {
        dish.favoritedBy.push({ id: userId });

        resolve(true);
      }

      reject(
        new HandledError(
          `Unable to favorite dish ${dishId} for user ${userId}`,
          422
        )
      );
    });

    return dish;
  }

  async removeLike({ userId, dishId }: LikeParams): Promise<boolean> {
    const dish: Promise<boolean> = new Promise((resolve, reject) => {
      const dish = this.dishes.find((d) => d.id === dishId);

      if (dish) {
        dish.favoritedBy = dish.favoritedBy.filter((u) => u.id !== userId);

        resolve(true);
      }

      reject(
        new HandledError(
          `Unable to unfavorite dish ${dishId} for user ${userId}`,
          422
        )
      );
    });

    return dish;
  }
}

export default DishesRepositoryInMemory;
