import { User } from "@prisma/client";
import { hash } from "bcryptjs";

import iUserRepository, {
  ICreateUserParams,
} from "../repositories/IUsersRepository";

class UsersService {
  constructor(private userRepository: iUserRepository) {}

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
