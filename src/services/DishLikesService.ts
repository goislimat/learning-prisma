import IDishesRepository from "../repositories/IDishesRepository";
import { LikeParams } from "../types/like";

class DishLikesService {
  constructor(private dishesRepository: IDishesRepository) {}

  async like(params: LikeParams): Promise<boolean> {
    const result = await this.dishesRepository.saveLike(params);
    return result;
  }

  async dislike(params: LikeParams): Promise<boolean> {
    const result = await this.dishesRepository.removeLike(params);
    return result;
  }
}

export default DishLikesService;
