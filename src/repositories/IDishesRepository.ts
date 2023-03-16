import {
  DishCreateInput,
  DishTransactionResponse,
  DishUpdateInput,
} from "../types/dish";
import { LikeParams } from "../types/like";

interface IDishesRepository {
  findAll(q?: string): Promise<DishTransactionResponse[]>;
  findById(id: number): Promise<DishTransactionResponse>;
  save(data: DishCreateInput): Promise<DishTransactionResponse>;
  update(data: DishUpdateInput): Promise<DishTransactionResponse>;
  saveLike(data: LikeParams): Promise<boolean>;
  removeLike(data: LikeParams): Promise<boolean>;
}

export default IDishesRepository;
