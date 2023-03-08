import { User } from "@prisma/client";
import { compare, hash } from "bcryptjs";
import { sign } from "jsonwebtoken";
import jwt from "../config/auth";

import iUserRepository, {
  iCreateUserParams,
} from "../repositories/iUsersRepository";
import HandledError from "../utils/HandledError";

class UsersService {
  constructor(private userRepository: iUserRepository) {}

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);

    return user;
  }

  async validateCredentials(user: User, password: string): Promise<boolean> {
    const passwordsMatch = await compare(password, user.password);

    if (!passwordsMatch) {
      throw new HandledError(
        "This email/password combination is not valid",
        404
      );
    }

    return passwordsMatch;
  }

  generateToken(userId: number): string {
    const token = sign({}, jwt.secret, {
      subject: String(userId),
      expiresIn: jwt.expiresIn,
    });

    return token;
  }

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
