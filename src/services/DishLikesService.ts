import IDishesRepository, {
  IDishWithIngredientsAndUser,
} from "../repositories/IDishesRepository";

interface LikeParams {
  userId: number;
  dishId: string;
}

class DishLikesService {
  constructor(private dishesRepository: IDishesRepository) {}

  async like({
    userId,
    dishId,
  }: LikeParams): Promise<IDishWithIngredientsAndUser> {
    const id = Number(dishId);
    const dish = await this.dishesRepository.saveLike({ userId, dishId: id });

    return dish;
  }
}

export default DishLikesService;
