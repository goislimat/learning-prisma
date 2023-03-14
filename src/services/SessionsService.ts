import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

import jwt from "../config/auth";
import IUsersRepository from "../repositories/IUsersRepository";
import { SessionCreateInput, User, UserWithoutPassword } from "../types/user";
import HandledError from "../utils/HandledError";

class SessionsService {
  constructor(private usersRepository: IUsersRepository) {}

  async create({
    email,
    password,
  }: SessionCreateInput): Promise<[UserWithoutPassword, string]> {
    const user = await this.usersRepository.findByEmail(email);

    await this.validateCredentials(user, password);
    const token = this.generateToken(user.id);

    const userWithoutPassword = this.exclude(user, ["password"]);

    return [userWithoutPassword, token];
  }

  private async validateCredentials(
    user: User,
    password: string
  ): Promise<void> {
    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new HandledError(
        "This email/password combination is not valid",
        404
      );
    }
  }

  private generateToken(userId: number): string {
    const token = sign({}, jwt.secret, {
      subject: String(userId),
      expiresIn: jwt.expiresIn,
    });

    return token;
  }

  private exclude<User, Key extends keyof User>(
    user: User,
    keys: Key[]
  ): Omit<User, Key> {
    for (let key of keys) {
      delete user[key];
    }

    return user;
  }
}

export default SessionsService;
