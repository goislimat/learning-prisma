import IDishesRepository, {
  ICreateDishParams,
  IDishCreatedResponse,
} from "./IDishesRepository";

class DishesRepositoryInMemory implements IDishesRepository {
  public dishes: IDishCreatedResponse[] = [];

  async save(dish: ICreateDishParams): Promise<IDishCreatedResponse> {
    const dishWithIngredients: Promise<IDishCreatedResponse> = new Promise(
      (resolve, reject) => {
        const createdDish = {
          ...dish,
          id: Math.floor(Math.random() * 100) + 1,
          ingredients: dish.ingredients.map((ingredient) => ({
            id: Math.floor(Math.random() * 100) + 1,
            name: ingredient,
            createdAt: new Date(Date.now()),
            updatedAt: new Date(Date.now()),
          })),
          createdAt: new Date(Date.now()),
          updatedAt: new Date(Date.now()),
        };

        this.dishes.push(createdDish);

        resolve(createdDish);
      }
    );

    return dishWithIngredients;
  }
}

export default DishesRepositoryInMemory;
