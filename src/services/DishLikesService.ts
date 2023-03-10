import IDishesRepository from "../repositories/IDishesRepository";

interface LikeParams {
  userId: number;
  dishId: string;
}

class DishLikesService {
  constructor(private dishesRepository: IDishesRepository) {}

  async like({ userId, dishId }: LikeParams): Promise<void> {
    const id = Number(dishId);

    await this.dishesRepository.saveLike({ userId, dishId: id });
  }
}

export default DishLikesService;
