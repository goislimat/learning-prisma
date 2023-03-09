import { User } from "@prisma/client";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

import jwt from "../config/auth";
import IUsersRepository from "../repositories/IUsersRepository";
import HandledError from "../utils/HandledError";

interface UserParams {
  email: string;
  password: string;
}

class SessionsService {
  constructor(private usersRepository: IUsersRepository) {}

  async create({ email, password }: UserParams): Promise<[User, string]> {
    const user = await this.usersRepository.findByEmail(email);

    await this.validateCredentials(user, password);
    const token = this.generateToken(user.id);

    return [user, token];
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
}

export default SessionsService;
