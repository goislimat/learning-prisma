import { hash } from "bcryptjs";

import IUsersRepository from "../repositories/IUsersRepository";
import { User, UserCreateInput, UserWithoutPassword } from "../types/user";

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
  }: UserCreateInput): Promise<UserWithoutPassword> {
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
