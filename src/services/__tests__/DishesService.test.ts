import DishesRepositoryInMemory from "../../repositories/DishesRepositoryInMemory";
import DishesService from "../DishesService";
import DiskStorageService from "../DiskStorageService";

jest.mock("../DiskStorageService");

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

  it("should be able to update a dish", async () => {
    const diskStorageService = new DiskStorageService();
    const dishesRepositoryInMemory = new DishesRepositoryInMemory();
    const dishesService = new DishesService(
      dishesRepositoryInMemory,
      diskStorageService
    );

    // id: 1,
    //   image: "1678369738935-756807316-carbonara.webp",
    //   name: "Spaghetti alla Carbonara",
    //   category: "meal",
    //   price: 1999,
    //   description:
    //     "Spaghetti made on bacon fat with spices and decorated with bacon cubes and grated cheese",
    //   ingredients: [
    //     {
    //       name: "pasta",
    //     },
    //     {
    //       name: "cheese",
    //     },
    //     {
    //       name: "bacon",
    //     },
    //   ],

    const currentDish = await dishesService.getDishById("1");

    expect(currentDish).toEqual({
      id: 1,
      name: "Spaghetti alla Carbonara",
      category: "meal",
      price: 1999,
      description:
        "Spaghetti made on bacon fat with spices and decorated with bacon cubes and grated cheese",
      ingredients: ["pasta", "cheese", "bacon"],
      image: "1678369738935-756807316-carbonara.webp",
      favoritedBy: [],
    });

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

    const updatedDish = await dishesService.updateDish("1", dishFields);

    expect(saveFileSpy).toHaveBeenCalledWith(dishFields.image);
    expect(deleteFileSpy).toHaveBeenCalledWith(currentDish.image);

    expect(updatedDish).toEqual({
      id: 1,
      name: "Rice and Beans",
      category: "meal",
      price: 999,
      description: "Plain and simple rice and beans",
      ingredients: ["rice", "beans"],
      image: "rice-and-beans.jpg",
      favoritedBy: [],
    });
  });

  it("should rollback the image if the dish update fails", async () => {
    const diskStorageService = new DiskStorageService();
    const dishesRepositoryInMemory = new DishesRepositoryInMemory();
    const dishesService = new DishesService(
      dishesRepositoryInMemory,
      diskStorageService
    );

    const currentDish = await dishesService.getDishById("1");

    expect(currentDish).toEqual({
      id: 1,
      name: "Spaghetti alla Carbonara",
      category: "meal",
      price: 1999,
      description:
        "Spaghetti made on bacon fat with spices and decorated with bacon cubes and grated cheese",
      ingredients: ["pasta", "cheese", "bacon"],
      image: "1678369738935-756807316-carbonara.webp",
      favoritedBy: [],
    });

    const dishFields = {
      name: "Rice and Beans",
      category: "meal",
      ingredients: "rice,beans",
      description: "",
      price: "R$ 9,99",
      image: "rice-and-beans.jpg",
    };

    const saveFileSpy = jest.spyOn(diskStorageService, "saveFile");
    const deleteFileSpy = jest.spyOn(diskStorageService, "deleteFile");

    await expect(dishesService.updateDish("1", dishFields)).rejects.toEqual({
      statusCode: 400,
      message: "The record could not be updated with the provided data",
    });

    expect(saveFileSpy).toHaveBeenCalledWith(dishFields.image);
    expect(deleteFileSpy).toHaveBeenCalledWith(dishFields.image, true);
  });

  it("should be able to return all dishes", async () => {
    const dishesRepositoryInMemory = new DishesRepositoryInMemory();
    const dishesService = new DishesService(dishesRepositoryInMemory);

    const dishes = await dishesService.getAllDishes();

    expect(dishes).toHaveLength(1);
    expect(dishes[0]).toHaveProperty("id");
  });

  it("should be able to fetch an existing record", async () => {
    const dishesRepositoryInMemory = new DishesRepositoryInMemory();
    const dishesService = new DishesService(dishesRepositoryInMemory);

    const dish = await dishesService.getDishById("1");

    expect(dish).toBeDefined();
    expect(dish.name).toEqual("Spaghetti alla Carbonara");
  });

  it("should throw a 404 if no record is found", async () => {
    const dishesRepositoryInMemory = new DishesRepositoryInMemory();
    const dishesService = new DishesService(dishesRepositoryInMemory);

    await expect(dishesService.getDishById("88")).rejects.toEqual({
      statusCode: 404,
      message: `Could not find a dish record with id: 88`,
    });
  });
});
