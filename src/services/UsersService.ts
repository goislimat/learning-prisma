import { User } from "@prisma/client";
import { hash } from "bcryptjs";

import iUserRepository, {
  iCreateUserParams,
} from "../repositories/iUsersRepository";

class UsersService {
  constructor(private userRepository: iUserRepository) {}

  async createUser({
    name,
    email,
    password,
  }: iCreateUserParams): Promise<User> {
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
