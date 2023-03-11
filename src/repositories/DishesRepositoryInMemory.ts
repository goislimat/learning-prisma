import HandledError from "../utils/HandledError";
import IDishesRepository, {
  IAddLike,
  ICreateDishParams,
  IDishWithIngredients,
} from "./IDishesRepository";

class DishesRepositoryInMemory implements IDishesRepository {
  public dishes: IDishWithIngredients[] = [
    {
      id: 1,
      image: "1678369738935-756807316-carbonara.webp",
      name: "Spaghetti alla Carbonara",
      category: "meal",
      price: 1999,
      description:
        "Spaghetti made on bacon fat with spices and decorated with bacon cubes and grated cheese",
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      ingredients: [
        {
          id: 1,
          name: "pasta",
          createdAt: new Date(Date.now()),
          updatedAt: new Date(Date.now()),
        },
        {
          id: 2,
          name: "cheese",
          createdAt: new Date(Date.now()),
          updatedAt: new Date(Date.now()),
        },
        {
          id: 3,
          name: "bacon",
          createdAt: new Date(Date.now()),
          updatedAt: new Date(Date.now()),
        },
      ],
      favoritedBy: [
        {
          id: 2,
        },
      ],
    },
  ];

  async findAll(): Promise<IDishWithIngredients[]> {
    const allDishes: Promise<IDishWithIngredients[]> = new Promise(
      (resolve) => {
        resolve(this.dishes);
      }
    );

    return allDishes;
  }

  async findById(id: number): Promise<IDishWithIngredients> {
    const dish: Promise<IDishWithIngredients> = new Promise(
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

  async save(dish: ICreateDishParams): Promise<IDishWithIngredients> {
    const dishWithIngredients: Promise<IDishWithIngredients> = new Promise(
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

  async saveLike({ userId, dishId }: IAddLike): Promise<boolean> {
    const liked = new Promise((resolve, reject) => {});
  }
}

export default DishesRepositoryInMemory;
