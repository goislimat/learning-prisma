import DishesRepositoryInMemory from "../../repositories/DishesRepositoryInMemory";
import DishLikesService from "../DishLikesService";

describe("DishLikesService", () => {
  it("should add a dish as favorite", async () => {
    const dishesRepositoryInMemory = new DishesRepositoryInMemory();
    const dishLikesService = new DishLikesService(dishesRepositoryInMemory);

    const result = await dishLikesService.like({ userId: 2, dishId: 1 });

    expect(result).toBe(true);
  });

  it("should throw an error if the dish doesn't exist", async () => {
    const dishesRepositoryInMemory = new DishesRepositoryInMemory();
    const dishLikesService = new DishLikesService(dishesRepositoryInMemory);

    await expect(
      dishLikesService.like({ userId: 2, dishId: 2 })
    ).rejects.toEqual({
      statusCode: 422,
      message: `Unable to favorite dish 2 for user 2`,
    });
  });

  it("should remove a dish as favorite", async () => {
    const dishesRepositoryInMemory = new DishesRepositoryInMemory();
    const dishLikesService = new DishLikesService(dishesRepositoryInMemory);

    await dishLikesService.like({ userId: 2, dishId: 1 });

    const result = await dishLikesService.dislike({ userId: 2, dishId: 1 });

    expect(result).toBe(true);
  });

  it("should throw an error if the dish doesn't exist", async () => {
    const dishesRepositoryInMemory = new DishesRepositoryInMemory();
    const dishLikesService = new DishLikesService(dishesRepositoryInMemory);

    await expect(
      dishLikesService.dislike({ userId: 2, dishId: 2 })
    ).rejects.toEqual({
      statusCode: 422,
      message: `Unable to unfavorite dish 2 for user 2`,
    });
  });
});
