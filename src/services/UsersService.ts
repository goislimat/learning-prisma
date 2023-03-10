import { User } from "@prisma/client";
import { hash } from "bcryptjs";

import IUsersRepository, {
  ICreateUserParams,
} from "../repositories/IUsersRepositoryInterface";

class UsersService {
  constructor(private userRepository: IUsersRepository) {}

  async getById(id: number): Promise<User> {
    const user = await this.userRepository.findById(id);

    return user;
  }

  async createUser({
    name,
    email,
    password,
  }: ICreateUserParams): Promise<User> {
    const hashedPassword = await hash(password, 8);

    const user = await this.userRepository.save({
      name,
      email,
      password: hashedPassword,
    });

    return user;
  }
}

export default UsersService;
