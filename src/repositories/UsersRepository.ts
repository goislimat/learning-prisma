import { Prisma, PrismaClient, User } from "@prisma/client";
import HandledError from "../utils/HandledError";

import iUsersRepository, { iCreateUserParams } from "./iUsersRepository";

class UsersRepository implements iUsersRepository {
  private prisma = new PrismaClient();

  async findByEmail(email: string): Promise<User> {
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: {
          email,
        },
      });

      return user;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2015") {
          throw new HandledError(
            "This email/password combination is not valid",
            404
          );
        }
      }

      throw err;
    }
  }

  async save({ name, email, password }: iCreateUserParams) {
    try {
      const user = await this.prisma.user.create({
        data: {
          name,
          email,
          password,
        },
      });

      return user;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
          throw new HandledError("This email is already taken");
        }
      }

      throw err;
    }
  }
}

export default UsersRepository;
