import IDishesRepository, {
  IDishWithIngredientsAndUser,
} from "../repositories/IDishesRepository";

interface LikeParams {
  userId: number;
  dishId: number;
}

class DishLikesService {
  constructor(private dishesRepository: IDishesRepository) {}

  async like(params: LikeParams): Promise<IDishWithIngredientsAndUser> {
    const dish = await this.dishesRepository.saveLike(params);

    return dish;
  }

  async dislike(params: LikeParams): Promise<IDishWithIngredientsAndUser> {
    const dish = await this.dishesRepository.removeLike(params);

    return dish;
  }
}

export default DishLikesService;
