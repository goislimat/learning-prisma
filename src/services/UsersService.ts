import { Prisma } from "@prisma/client";
import { hash } from "bcryptjs";

import IUsersRepository, { User } from "../repositories/IUsersRepository";

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
  }: Prisma.UserCreateInput): Promise<User> {
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
