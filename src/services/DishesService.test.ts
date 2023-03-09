import DishesRepositoryInMemory from "../repositories/DishesRepositoryInMemory";
import DishesService from "./DishesService";
import DiskStorageService from "./DiskStorageService";

jest.mock("./DiskStorageService");

describe("DishesService", () => {
  it("should be able to create a new dish", async () => {
    const diskStorageService = new DiskStorageService();
    const dishesRepositoryInMemory = new DishesRepositoryInMemory();
    const dishesService = new DishesService(
      dishesRepositoryInMemory,
      diskStorageService
    );

    const dishFields = {
      name: "Rice and Beans",
      category: "meal",
      ingredients: "rice,beans",
      description: "Plain and simple rice and beans",
      price: "R$ 9,99",
      image: "rice-and-beans.jpg",
    };

    const saveFileSpy = jest.spyOn(diskStorageService, "saveFile");
    const deleteFileSpy = jest.spyOn(diskStorageService, "deleteFile");

    const createdDish = await dishesService.createDish(dishFields);

    expect(saveFileSpy).toHaveBeenCalledWith(dishFields.image);
    expect(createdDish).toHaveProperty("id");
    expect(createdDish.ingredients).toHaveLength(2);
    expect(deleteFileSpy).not.toHaveBeenCalled();
  });

  it("should not be able to create a new dish if the image is missing", async () => {
    const diskStorageService = new DiskStorageService();
    const dishesRepositoryInMemory = new DishesRepositoryInMemory();
    const dishesService = new DishesService(
      dishesRepositoryInMemory,
      diskStorageService
    );

    const dishFields = {
      name: "Rice and Beans",
      category: "meal",
      ingredients: "rice,beans",
      description: "Plain and simple rice and beans",
      price: "R$ 9,99",
    };

    await expect(dishesService.createDish(dishFields)).rejects.toEqual({
      statusCode: 400,
      message: "The dish image is missing",
    });

    expect(diskStorageService.saveFile).not.toHaveBeenCalled();
  });

  it("should delete the image if the dish creation fails", async () => {
    const diskStorageService = new DiskStorageService();
    const dishesRepositoryInMemory = new DishesRepositoryInMemory();
    const dishesService = new DishesService(
      dishesRepositoryInMemory,
      diskStorageService
    );

    const dishFields = {
      name: "Rice and Beans",
      category: "meal",
      ingredients: "",
      description: "Plain and simple rice and beans",
      price: "R$ 9,99",
      image: "rice-and-beans.jpg",
    };

    const saveFileSpy = jest.spyOn(diskStorageService, "saveFile");
    const deleteFileSpy = jest.spyOn(diskStorageService, "deleteFile");

    await expect(dishesService.createDish(dishFields)).rejects.toEqual({
      statusCode: 400,
      message: "The dish must have at least one ingredient",
    });

    expect(saveFileSpy).toHaveBeenCalledWith(dishFields.image);
    expect(deleteFileSpy).toHaveBeenCalledWith(dishFields.image);
  });
});
