import IDishesRepository, {
  IDishWithIngredientsAndUser,
} from "../repositories/IDishesRepository";
import HandledError from "../utils/HandledError";
import DiskStorageService from "./DiskStorageService";

interface IDishFields {
  name: string;
  category: string;
  ingredients: string;
  description: string;
  price: number;
  image?: string;
}

interface IFormattedDish {
  id: number;
  name: string;
  category: string;
  ingredients: string[];
  description: string;
  price: number;
  image: string;
  favoritedBy: number[];
}

class DishesService {
  constructor(
    private dishesRepository: IDishesRepository,
    private diskStorageService: DiskStorageService = {} as DiskStorageService
  ) {}

  async getAllDishes(): Promise<IFormattedDish[]> {
    const dishes = await this.dishesRepository.findAll();

    return dishes.map((dish) => this.getFormattedDish(dish));
  }

  async getDishById(id: number): Promise<any> {
    const dish = await this.dishesRepository.findById(id);

    return this.getFormattedDish(dish);
  }

  async createDish({
    name,
    category,
    ingredients,
    description,
    price,
    image,
  }: IDishFields): Promise<IFormattedDish> {
    if (!image) {
      throw new HandledError("The dish image is missing", 400);
    }

    try {
      await this.diskStorageService.saveFile(image);

      const ingredientsArray = this.getIngredientsArray(ingredients);

      const dish = await this.dishesRepository.save({
        name,
        category,
        ingredients: ingredientsArray,
        description,
        price,
        image,
      });

      return this.getFormattedDish(dish);
    } catch (err) {
      this.diskStorageService.deleteFile(image);

      throw err;
    }
  }

  async updateDish(
    id: number,
    { name, category, ingredients, description, price, image }: IDishFields
  ): Promise<IFormattedDish> {
    const dish = await this.dishesRepository.findById(id);

    if (!dish) {
      throw new HandledError("Dish not found", 404);
    }

    const storedImage = this.updateImage(image, dish.image);
    const [ingredientsToAdd, ingredientsToRemove] = this.getIngredientsToUpdate(
      dish.ingredients,
      ingredients
    );

    try {
      await storedImage.update();

      const updatedDish = await this.dishesRepository.update({
        id,
        image: image || dish.image,
        name,
        category,
        price,
        description,
        ingredientsToAdd,
        ingredientsToRemove,
      });

      await storedImage.deletePrevious();

      return this.getFormattedDish(updatedDish);
    } catch (err) {
      await storedImage.rollback();

      throw err;
    }
  }

  private getIngredientsArray(ingredients: string): string[] {
    const ingredientsArray = ingredients
      .split(",")
      .filter(String)
      .map((ingredient) => ingredient.trim().toLowerCase());

    if (ingredientsArray.length === 0) {
      throw new HandledError("The dish must have at least one ingredient", 400);
    }

    return ingredientsArray;
  }

  private getFormattedDish(dish: IDishWithIngredientsAndUser): IFormattedDish {
    return {
      ...dish,
      ingredients: dish.ingredients.map((ingredient) => ingredient.name),
      favoritedBy: dish.favoritedBy.map((user) => user.id),
    };
  }

  private getIngredientsToUpdate(
    previousIngredients: { name: string }[],
    newIngredients: string
  ): [string[], string[]] {
    const previousIngredientsArray = previousIngredients.map(
      (ingredient) => ingredient.name
    );
    const newIngredientsArray = this.getIngredientsArray(newIngredients);

    const ingredientsToRemove = previousIngredientsArray.filter(
      (ingredient) => !newIngredientsArray.includes(ingredient)
    );
    const ingredientsToAdd = newIngredientsArray.filter(
      (ingredient) => !previousIngredientsArray.includes(ingredient)
    );

    return [ingredientsToAdd, ingredientsToRemove];
  }

  private updateImage(
    newImage: string | undefined,
    oldImage: string
  ): {
    update: () => Promise<void>;
    deletePrevious: () => Promise<void>;
    rollback: () => Promise<void>;
  } {
    if (newImage) {
      return {
        update: () => this.diskStorageService.saveFile(newImage),
        deletePrevious: () => this.diskStorageService.deleteFile(oldImage),
        rollback: () => this.diskStorageService.deleteFile(newImage, true),
      };
    }

    return {
      update: () => Promise.resolve(),
      deletePrevious: () => Promise.resolve(),
      rollback: () => Promise.resolve(),
    };
  }
}

export default DishesService;
